-- Add banner_url column to profiles table
ALTER TABLE profiles ADD COLUMN banner_url TEXT;

-- Update storage policies to include banners bucket
-- (You'll also need to create a "banners" bucket in Supabase Dashboard > Storage)

-- Banners bucket policies
CREATE POLICY "Banner uploads are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Users can upload their own banner" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'banners' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own banner" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'banners' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own banner" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'banners' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );