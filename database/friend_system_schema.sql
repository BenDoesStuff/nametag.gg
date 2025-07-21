-- ====================================
-- NAMETAG FRIEND SYSTEM DATABASE SCHEMA
-- ====================================

-- Create friend_requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Prevent duplicate requests and self-requests
CREATE UNIQUE INDEX IF NOT EXISTS friend_requests_unique_pair 
ON friend_requests (LEAST(requester, recipient), GREATEST(requester, recipient))
WHERE status != 'declined';

-- Prevent self-friend requests
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'no_self_requests' 
        AND conrelid = 'friend_requests'::regclass
    ) THEN
        ALTER TABLE friend_requests ADD CONSTRAINT no_self_requests 
        CHECK (requester != recipient);
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_friend_requests_requester ON friend_requests(requester);
CREATE INDEX IF NOT EXISTS idx_friend_requests_recipient ON friend_requests(recipient);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);
CREATE INDEX IF NOT EXISTS idx_friend_requests_created_at ON friend_requests(created_at DESC);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_friend_requests_updated_at ON friend_requests;

-- Create the trigger
CREATE TRIGGER update_friend_requests_updated_at 
    BEFORE UPDATE ON friend_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- ROW LEVEL SECURITY POLICIES
-- ====================================

-- Enable RLS
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can send friend requests" ON friend_requests;
DROP POLICY IF EXISTS "Users can view their friend requests" ON friend_requests;
DROP POLICY IF EXISTS "Recipients can update request status" ON friend_requests;
DROP POLICY IF EXISTS "Users can delete their requests" ON friend_requests;

-- Policy 1: Users can insert friend requests (as requester only)
CREATE POLICY "Users can send friend requests" ON friend_requests
  FOR INSERT WITH CHECK (
    auth.uid() = requester 
    AND requester != recipient
  );

-- Policy 2: Users can view requests they're involved in
CREATE POLICY "Users can view their friend requests" ON friend_requests
  FOR SELECT USING (
    auth.uid() = requester OR auth.uid() = recipient
  );

-- Policy 3: Only recipients can update request status
CREATE POLICY "Recipients can update request status" ON friend_requests
  FOR UPDATE USING (auth.uid() = recipient)
  WITH CHECK (auth.uid() = recipient);

-- Policy 4: Users can delete their own requests (unfriend)
CREATE POLICY "Users can delete their requests" ON friend_requests
  FOR DELETE USING (
    auth.uid() = requester OR auth.uid() = recipient
  );

-- ====================================
-- HELPER VIEWS
-- ====================================

-- View for accepted friendships (bidirectional)
CREATE OR REPLACE VIEW friends AS
SELECT DISTINCT
  CASE 
    WHEN fr.requester = auth.uid() THEN fr.recipient
    ELSE fr.requester
  END as friend_id,
  fr.created_at as friendship_date,
  p.username,
  p.display_name,
  p.avatar_url
FROM friend_requests fr
JOIN profiles p ON (
  CASE 
    WHEN fr.requester = auth.uid() THEN fr.recipient
    ELSE fr.requester
  END = p.id
)
WHERE fr.status = 'accepted'
  AND (fr.requester = auth.uid() OR fr.recipient = auth.uid());

-- Grant access to the view
GRANT SELECT ON friends TO authenticated;

-- ====================================
-- SEARCH OPTIMIZATION
-- ====================================

-- Add search indexes for profiles (if not exists)
CREATE INDEX IF NOT EXISTS idx_profiles_username_search 
ON profiles USING gin(to_tsvector('english', username));

CREATE INDEX IF NOT EXISTS idx_profiles_display_name_search 
ON profiles USING gin(to_tsvector('english', display_name));

-- Case-insensitive search index
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower 
ON profiles(lower(username));

CREATE INDEX IF NOT EXISTS idx_profiles_display_name_lower 
ON profiles(lower(display_name));