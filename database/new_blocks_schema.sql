-- ====================================
-- NEW BLOCKS DATABASE SCHEMA
-- ====================================

-- Table for media gallery images
CREATE TABLE IF NOT EXISTS profile_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  caption text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table for team roster
CREATE TABLE IF NOT EXISTS profile_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_name text NOT NULL,
  role text,
  avatar_url text,
  social_links jsonb DEFAULT '{}',
  joined_at timestamp with time zone DEFAULT now(),
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add new columns to profiles table for additional block data
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS about_text text,
ADD COLUMN IF NOT EXISTS about_qa jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS stream_platform text CHECK (stream_platform IN ('twitch', 'youtube')),
ADD COLUMN IF NOT EXISTS stream_channel text,
ADD COLUMN IF NOT EXISTS stream_last_title text,
ADD COLUMN IF NOT EXISTS stream_last_thumbnail text;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_media_profile_id ON profile_media(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_media_display_order ON profile_media(profile_id, display_order);
CREATE INDEX IF NOT EXISTS idx_profile_team_profile_id ON profile_team(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_team_display_order ON profile_team(profile_id, display_order);

-- Update timestamp triggers for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_profile_media_updated_at ON profile_media;
DROP TRIGGER IF EXISTS update_profile_team_updated_at ON profile_team;

-- Create the triggers
CREATE TRIGGER update_profile_media_updated_at 
    BEFORE UPDATE ON profile_media 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_team_updated_at 
    BEFORE UPDATE ON profile_team 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- ROW LEVEL SECURITY POLICIES
-- ====================================

-- Enable RLS
ALTER TABLE profile_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_team ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own media" ON profile_media;
DROP POLICY IF EXISTS "Media is publicly readable" ON profile_media;
DROP POLICY IF EXISTS "Users can manage their own team" ON profile_team;
DROP POLICY IF EXISTS "Team roster is publicly readable" ON profile_team;

-- Profile Media Policies
CREATE POLICY "Users can manage their own media" ON profile_media
  FOR ALL USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Media is publicly readable" ON profile_media
  FOR SELECT USING (true);

-- Profile Team Policies  
CREATE POLICY "Users can manage their own team" ON profile_team
  FOR ALL USING (
    profile_id IN (
      SELECT id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Team roster is publicly readable" ON profile_team
  FOR SELECT USING (true);

-- Grant access to tables
GRANT SELECT, INSERT, UPDATE, DELETE ON profile_media TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON profile_team TO authenticated;
GRANT SELECT ON profile_media TO anon;
GRANT SELECT ON profile_team TO anon;

-- Grant sequence access
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;