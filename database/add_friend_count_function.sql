-- Add friend count function for user profiles
-- Run this in Supabase SQL Editor

-- Function to get friend count for any user
CREATE OR REPLACE FUNCTION get_user_friend_count(target_user_id uuid)
RETURNS integer AS $$
BEGIN
  -- Count accepted friend requests where the user is either requester or recipient
  RETURN (
    SELECT COUNT(*)::integer
    FROM friend_requests
    WHERE status = 'accepted' 
    AND (requester = target_user_id OR recipient = target_user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_friend_count(uuid) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_user_friend_count(uuid) IS 'Returns the total number of friends for a given user ID by counting accepted friend requests';

-- Test the function (replace with actual user ID for testing)
-- SELECT get_user_friend_count('your-user-id-here');

-- Alternative: Create a view for easier access to friend counts
CREATE OR REPLACE VIEW user_friend_counts AS
SELECT 
  p.id as user_id,
  p.username,
  p.display_name,
  get_user_friend_count(p.id) as friend_count
FROM profiles p;

-- Grant select permission on the view
GRANT SELECT ON user_friend_counts TO authenticated, anon;

-- Add RLS policy for the view (allows anyone to read friend counts - this is public data)
ALTER VIEW user_friend_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view friend counts" ON user_friend_counts
  FOR SELECT USING (true);

-- Add comment for the view
COMMENT ON VIEW user_friend_counts IS 'Public view showing friend counts for all users';