-- Alternative: Temporarily disable RLS for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Then re-enable with simpler policies once it's working
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations" ON profiles USING (true) WITH CHECK (true);