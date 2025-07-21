-- ============================================
-- SPOTIFY INTEGRATION DATABASE SCHEMA
-- ============================================
-- Run this in your Supabase SQL editor

-- Extend profiles table with Spotify data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS spotify_refresh_token text,
ADD COLUMN IF NOT EXISTS spotify_display_name text,
ADD COLUMN IF NOT EXISTS spotify_user_id text,
ADD COLUMN IF NOT EXISTS spotify_connected_at timestamp with time zone;

-- Create table for storing user's favorite Spotify tracks
CREATE TABLE IF NOT EXISTS public.profile_spotify_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  track_id text NOT NULL,
  title text NOT NULL,
  artist text NOT NULL,
  album text,
  album_art_url text,
  preview_url text,
  external_url text,
  duration_ms integer,
  popularity integer,
  added_at timestamp with time zone DEFAULT now(),
  time_range text DEFAULT 'short_term', -- short_term, medium_term, long_term
  track_position integer, -- position in user's top tracks
  
  -- Ensure unique track per user
  UNIQUE(profile_id, track_id)
);

-- Enable Row Level Security
ALTER TABLE public.profile_spotify_tracks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profile_spotify_tracks
-- Users can manage their own tracks
CREATE POLICY "Users can insert own Spotify tracks" ON public.profile_spotify_tracks
  FOR INSERT WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own Spotify tracks" ON public.profile_spotify_tracks
  FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Users can delete own Spotify tracks" ON public.profile_spotify_tracks
  FOR DELETE USING (profile_id = auth.uid());

-- Anyone can view public Spotify tracks
CREATE POLICY "Anyone can view Spotify tracks" ON public.profile_spotify_tracks
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spotify_tracks_profile_id ON public.profile_spotify_tracks(profile_id);
CREATE INDEX IF NOT EXISTS idx_spotify_tracks_added_at ON public.profile_spotify_tracks(added_at DESC);
CREATE INDEX IF NOT EXISTS idx_spotify_tracks_position ON public.profile_spotify_tracks(profile_id, track_position);

-- Create a view for getting user's top tracks in order
CREATE OR REPLACE VIEW public.user_top_spotify_tracks AS
SELECT 
  pst.*,
  p.username,
  p.display_name as user_display_name
FROM public.profile_spotify_tracks pst
JOIN public.profiles p ON p.id = pst.profile_id
ORDER BY pst.profile_id, pst.track_position ASC;

-- Grant access to the view
GRANT SELECT ON public.user_top_spotify_tracks TO authenticated, anon;

-- Add comments for documentation
COMMENT ON TABLE public.profile_spotify_tracks IS 'Stores users favorite Spotify tracks from their top tracks';
COMMENT ON COLUMN public.profiles.spotify_refresh_token IS 'Encrypted Spotify refresh token for API access';
COMMENT ON COLUMN public.profiles.spotify_display_name IS 'Users Spotify display name (optional override)';
COMMENT ON COLUMN public.profiles.spotify_user_id IS 'Spotify user ID for API calls';
COMMENT ON COLUMN public.profiles.spotify_connected_at IS 'When user connected their Spotify account';

-- Function to clean up old tracks when refreshing
CREATE OR REPLACE FUNCTION public.refresh_user_spotify_tracks(
  user_id uuid,
  time_range_param text DEFAULT 'short_term'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete existing tracks for this time range
  DELETE FROM public.profile_spotify_tracks 
  WHERE profile_id = user_id AND time_range = time_range_param;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.refresh_user_spotify_tracks TO authenticated;