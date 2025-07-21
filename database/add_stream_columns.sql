-- Add all stream-related columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stream_platform text CHECK (stream_platform IN ('twitch', 'youtube')),
ADD COLUMN IF NOT EXISTS stream_channel text,
ADD COLUMN IF NOT EXISTS stream_last_title text,
ADD COLUMN IF NOT EXISTS stream_last_thumbnail text,
ADD COLUMN IF NOT EXISTS featured_video_url text,
ADD COLUMN IF NOT EXISTS featured_video_title text;

-- Add comments to describe the new columns
COMMENT ON COLUMN profiles.stream_platform IS 'Streaming platform: twitch or youtube';
COMMENT ON COLUMN profiles.stream_channel IS 'Channel username/handle for streaming';
COMMENT ON COLUMN profiles.stream_last_title IS 'Title of the last stream';
COMMENT ON COLUMN profiles.stream_last_thumbnail IS 'Thumbnail URL of the last stream';
COMMENT ON COLUMN profiles.featured_video_url IS 'YouTube video URL for featured video block';
COMMENT ON COLUMN profiles.featured_video_title IS 'Title for the featured video';

-- Create an index on stream_platform for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_stream_platform ON profiles(stream_platform) WHERE stream_platform IS NOT NULL;