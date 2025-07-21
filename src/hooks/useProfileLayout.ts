"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ProfileLayout, ProfileBlock, ProfileTheme } from '@/types/layout';
import { DEFAULT_THEME } from '@/lib/themePresets';
import { getDefaultLayout } from '@/lib/blockDefinitions';

interface UseProfileLayoutReturn {
  layout: ProfileLayout | null;
  loading: boolean;
  error: string | null;
  saveLayout: (blocks: ProfileBlock[], theme?: ProfileTheme) => Promise<boolean>;
  updateBlocks: (blocks: ProfileBlock[]) => Promise<boolean>;
  updateTheme: (theme: ProfileTheme) => Promise<boolean>;
  resetToDefault: () => Promise<boolean>;
}

export function useProfileLayout(profileId?: string): UseProfileLayoutReturn {
  const [layout, setLayout] = useState<ProfileLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch layout from database
  const fetchLayout = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profile_layout')
        .select('*')
        .eq('profile_id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create default layout if none exists
        const defaultBlocks = getDefaultLayout();
        const defaultLayout: ProfileLayout = {
          profile_id: id,
          blocks: defaultBlocks,
          theme: DEFAULT_THEME,
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('profile_layout')
          .insert({
            profile_id: id,
            blocks: defaultBlocks,
            theme: DEFAULT_THEME
          });

        if (insertError) {
          console.error('Error creating default layout:', insertError);
        }

        setLayout(defaultLayout);
      } else {
        setLayout(data);
      }
    } catch (err) {
      console.error('Error fetching profile layout:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch layout');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save complete layout
  const saveLayout = useCallback(async (
    blocks: ProfileBlock[], 
    theme?: ProfileTheme
  ): Promise<boolean> => {
    if (!profileId) return false;

    try {
      const updateData = {
        blocks,
        ...(theme && { theme })
      };

      const { error } = await supabase
        .from('profile_layout')
        .upsert({
          profile_id: profileId,
          ...updateData
        });

      if (error) throw error;

      // Update local state
      setLayout(prev => prev ? {
        ...prev,
        blocks,
        ...(theme && { theme }),
        updated_at: new Date().toISOString()
      } : null);

      return true;
    } catch (err) {
      console.error('Error saving layout:', err);
      setError(err instanceof Error ? err.message : 'Failed to save layout');
      return false;
    }
  }, [profileId]);

  // Update only blocks
  const updateBlocks = useCallback(async (blocks: ProfileBlock[]): Promise<boolean> => {
    return saveLayout(blocks);
  }, [saveLayout]);

  // Update only theme
  const updateTheme = useCallback(async (theme: ProfileTheme): Promise<boolean> => {
    if (!layout) return false;
    return saveLayout(layout.blocks, theme);
  }, [layout, saveLayout]);

  // Reset to default layout
  const resetToDefault = useCallback(async (): Promise<boolean> => {
    const defaultBlocks = getDefaultLayout();
    return saveLayout(defaultBlocks, DEFAULT_THEME);
  }, [saveLayout]);

  // Fetch layout when profileId changes
  useEffect(() => {
    if (profileId) {
      fetchLayout(profileId);
    } else {
      setLayout(null);
      setLoading(false);
    }
  }, [profileId, fetchLayout]);

  return {
    layout,
    loading,
    error,
    saveLayout,
    updateBlocks,
    updateTheme,
    resetToDefault
  };
}

// Hook for current user's layout
export function useMyProfileLayout(): UseProfileLayoutReturn {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    getCurrentUser();
  }, []);

  return useProfileLayout(userId || undefined);
}