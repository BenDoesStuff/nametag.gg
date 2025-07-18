-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- 1. Allow anyone to view all profiles (public profiles)
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (true);

-- 2. Allow users to insert their own profile
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Allow users to update their own profile
CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Allow users to delete their own profile (optional)
CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE USING (auth.uid() = id);