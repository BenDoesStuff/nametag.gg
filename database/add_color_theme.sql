-- Add color theme customization to profiles table
-- Run this in Supabase SQL Editor

-- Add color_theme column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN color_theme jsonb DEFAULT '{
  "primary": "#39FF14",
  "primaryRgb": "57, 255, 20",
  "themeName": "neon-green"
}'::jsonb;

-- Add validation constraint to ensure valid color format
ALTER TABLE public.profiles 
ADD CONSTRAINT color_theme_validation 
CHECK (
  color_theme IS NULL OR (
    color_theme ? 'primary' AND 
    color_theme ? 'primaryRgb' AND 
    color_theme ? 'themeName' AND
    (color_theme->>'primary') ~ '^#[0-9A-Fa-f]{6}$'
  )
);

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_profiles_color_theme 
ON public.profiles USING GIN (color_theme);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.color_theme IS 'User''s color theme preferences including primary color, RGB values, and theme name';

-- Create function to validate hex colors
CREATE OR REPLACE FUNCTION validate_hex_color(hex_color text)
RETURNS boolean AS $$
BEGIN
  RETURN hex_color ~ '^#[0-9A-Fa-f]{6}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to convert hex to RGB
CREATE OR REPLACE FUNCTION hex_to_rgb(hex_color text)
RETURNS text AS $$
DECLARE
  r integer;
  g integer;
  b integer;
BEGIN
  -- Remove # if present
  hex_color := TRIM(LEADING '#' FROM hex_color);
  
  -- Convert hex to RGB
  r := ('x' || SUBSTRING(hex_color, 1, 2))::bit(8)::integer;
  g := ('x' || SUBSTRING(hex_color, 3, 2))::bit(8)::integer;
  b := ('x' || SUBSTRING(hex_color, 5, 2))::bit(8)::integer;
  
  RETURN r || ', ' || g || ', ' || b;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-update RGB values when primary color changes
CREATE OR REPLACE FUNCTION update_color_theme_rgb()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if color_theme is not null and has primary key
  IF NEW.color_theme IS NOT NULL AND NEW.color_theme ? 'primary' THEN
    NEW.color_theme := NEW.color_theme || jsonb_build_object(
      'primaryRgb', hex_to_rgb(NEW.color_theme->>'primary')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_color_theme_rgb ON public.profiles;
CREATE TRIGGER trigger_update_color_theme_rgb
  BEFORE INSERT OR UPDATE OF color_theme ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_color_theme_rgb();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- Example of updating a user's color theme (for testing)
-- UPDATE public.profiles 
-- SET color_theme = jsonb_build_object(
--   'primary', '#FF6B6B',
--   'primaryRgb', '255, 107, 107',
--   'themeName', 'coral-red'
-- )
-- WHERE id = 'your-user-id';