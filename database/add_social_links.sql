-- ====================================
-- SOCIAL LINKS FEATURE - DATABASE MIGRATION
-- ====================================

-- Add social_links JSONB column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb;

-- Add index for better performance on social_links queries
CREATE INDEX IF NOT EXISTS idx_profiles_social_links 
ON profiles USING gin(social_links);

-- Add check constraint to ensure social_links is always a valid object
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'valid_social_links_json' 
        AND conrelid = 'profiles'::regclass
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT valid_social_links_json 
        CHECK (jsonb_typeof(social_links) = 'object');
    END IF;
END $$;

-- Update RLS policies to allow users to update their social_links
-- The existing RLS policies should already cover this, but let's verify

-- View current policies (for reference)
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Example of updating social_links (for testing)
-- UPDATE profiles 
-- SET social_links = jsonb_build_object(
--     'discord', 'username#1234',
--     'steam', 'steamusername',
--     'github', 'githubusername'
-- )
-- WHERE id = auth.uid();

-- ====================================
-- SUPPORTED PLATFORMS REFERENCE
-- ====================================
/*
Supported platform keys and expected value formats:

• discord        -> username#1234 or discord.gg/invite
• steam          -> steamID64 or vanity URL
• xbox           -> gamertag
• playstation    -> PSN ID  
• riot           -> username#tag
• epic           -> Epic Games username
• github         -> GitHub username
• twitch         -> Twitch username/channel
• youtube        -> YouTube channel URL or @handle
• twitter        -> Twitter/X username
• instagram      -> Instagram username
• tiktok         -> TikTok username

Values are stored as strings and validated on the frontend.
*/