-- Add profile_games table for "Games I Play" feature
-- Run this in Supabase SQL Editor

-- Create profile_games table
CREATE TABLE IF NOT EXISTS public.profile_games (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_slug   text NOT NULL,
  created_at  timestamp DEFAULT now(),
  
  -- Ensure unique combination of profile + game
  CONSTRAINT unique_profile_game UNIQUE (profile_id, game_slug)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_games_profile_id ON public.profile_games(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_games_game_slug ON public.profile_games(game_slug);
CREATE INDEX IF NOT EXISTS idx_profile_games_created_at ON public.profile_games(created_at);

-- Enable Row Level Security
ALTER TABLE public.profile_games ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only insert/update/delete their own games
CREATE POLICY "Users can manage their own games" ON public.profile_games
  FOR ALL USING (auth.uid() = profile_id);

-- RLS Policy: Anyone can view profile games (public data)
CREATE POLICY "Anyone can view profile games" ON public.profile_games
  FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT ON public.profile_games TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profile_games TO authenticated;

-- Add constraint to limit max games per profile (10 games)
CREATE OR REPLACE FUNCTION check_max_games_per_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) 
    FROM public.profile_games 
    WHERE profile_id = NEW.profile_id
  ) >= 10 THEN
    RAISE EXCEPTION 'Maximum 10 games allowed per profile';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce max games limit
CREATE TRIGGER trigger_check_max_games
  BEFORE INSERT ON public.profile_games
  FOR EACH ROW
  EXECUTE FUNCTION check_max_games_per_profile();

-- Function to get games for a profile (with validation)
CREATE OR REPLACE FUNCTION get_profile_games(target_profile_id uuid)
RETURNS TABLE (
  id uuid,
  game_slug text,
  created_at timestamp
) AS $$
BEGIN
  RETURN QUERY
  SELECT pg.id, pg.game_slug, pg.created_at
  FROM public.profile_games pg
  WHERE pg.profile_id = target_profile_id
  ORDER BY pg.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION get_profile_games(uuid) TO anon, authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.profile_games IS 'Stores games that users want to showcase on their profiles (max 10 per user)';
COMMENT ON COLUMN public.profile_games.game_slug IS 'Identifier for the game from the games catalog';
COMMENT ON FUNCTION get_profile_games(uuid) IS 'Returns all games for a given profile ID, ordered by creation date';

-- Test the setup (uncomment to test with your user ID)
-- INSERT INTO public.profile_games (profile_id, game_slug) VALUES 
-- ('your-user-id-here', 'valorant');

-- Verify setup
SELECT 
  schemaname,
  tablename,
  attname as column_name,
  typname as data_type
FROM pg_tables pt
JOIN pg_attribute pa ON pa.attrelid = (SELECT oid FROM pg_class WHERE relname = pt.tablename)
JOIN pg_type pt2 ON pt2.oid = pa.atttypid
WHERE pt.tablename = 'profile_games' 
  AND pa.attnum > 0 
  AND NOT pa.attisdropped
ORDER BY pa.attnum;