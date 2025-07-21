"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface MediaItem {
  id: string;
  profile_id: string;
  url: string;
  caption?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useMedia(profileId?: string) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    if (!profileId) {
      setMediaItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: mediaData, error: mediaError } = await supabase
        .from('profile_media')
        .select('*')
        .eq('profile_id', profileId)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (mediaError) {
        throw new Error(mediaError.message);
      }

      setMediaItems(mediaData || []);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (file: File, caption?: string, displayOrder?: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      // Save to database
      const { data, error } = await supabase
        .from('profile_media')
        .insert([{
          profile_id: user.id,
          url: publicUrl,
          caption: caption || null,
          display_order: displayOrder ?? mediaItems.length
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setMediaItems(prev => [...prev, data].sort((a, b) => 
        a.display_order - b.display_order ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));

      return data;
    } catch (err) {
      console.error('Error uploading media:', err);
      throw err;
    }
  };

  const updateMedia = async (id: string, updates: Partial<MediaItem>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('profile_media')
        .update(updates)
        .eq('id', id)
        .eq('profile_id', user.id) // Ensure user owns this media
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setMediaItems(prev => 
        prev.map(item => item.id === id ? { ...item, ...data } : item)
      );

      return data;
    } catch (err) {
      console.error('Error updating media:', err);
      throw err;
    }
  };

  const removeMedia = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Get the media item to delete the file from storage
      const mediaItem = mediaItems.find(item => item.id === id);
      
      if (mediaItem) {
        // Extract file path from URL
        const urlParts = mediaItem.url.split('/');
        const fileName = urlParts.slice(-2).join('/'); // user_id/filename.ext
        
        // Delete from storage
        await supabase.storage
          .from('media')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('profile_media')
        .delete()
        .eq('id', id)
        .eq('profile_id', user.id); // Ensure user owns this media

      if (error) {
        throw new Error(error.message);
      }

      setMediaItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing media:', err);
      throw err;
    }
  };

  const reorderMedia = async (reorderedItems: MediaItem[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Update display_order for all items
      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        display_order: index
      }));

      const { error } = await supabase
        .from('profile_media')
        .upsert(updates.map(update => ({
          id: update.id,
          display_order: update.display_order,
          profile_id: user.id
        })));

      if (error) {
        throw new Error(error.message);
      }

      setMediaItems(reorderedItems);
    } catch (err) {
      console.error('Error reordering media:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [profileId]);

  return {
    mediaItems,
    loading,
    error,
    uploadMedia,
    updateMedia,
    removeMedia,
    reorderMedia,
    refetch: fetchMedia
  };
}