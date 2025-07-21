-- Add featured video columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS featured_video_url text,
ADD COLUMN IF NOT EXISTS featured_video_title text;

-- Add comments to describe the new columns
COMMENT ON COLUMN profiles.featured_video_url IS 'YouTube video URL for featured video block';
COMMENT ON COLUMN profiles.featured_video_title IS 'Title for the featured video';