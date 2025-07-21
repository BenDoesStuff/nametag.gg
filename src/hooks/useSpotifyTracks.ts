/**
 * Hook for fetching and managing user's Spotify tracks
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SpotifyTrack {
  id: string;
  profile_id: string;
  track_id: string;
  title: string;
  artist: string;
  album: string;
  album_art_url: string | null;
  preview_url: string | null;
  external_url: string | null;
  duration_ms: number | null;
  popularity: number | null;
  added_at: string;
  time_range: string;
  track_position: number;
}

interface UseSpotifyTracksOptions {
  timeRange?: 'short_term' | 'medium_term' | 'long_term';
  limit?: number;
  autoRefresh?: boolean;
}

interface UseSpotifyTracksReturn {
  tracks: SpotifyTrack[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  syncTracks: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSpotifyTracks(
  profileId?: string,
  options: UseSpotifyTracksOptions = {}
): UseSpotifyTracksReturn {
  const {
    timeRange = 'short_term',
    limit = 10,
    autoRefresh = true
  } = options;

  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchTracks = useCallback(async () => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch tracks from database
      const { data: tracksData, error: tracksError } = await supabase
        .from('profile_spotify_tracks')
        .select('*')
        .eq('profile_id', profileId)
        .eq('time_range', timeRange)
        .order('track_position', { ascending: true })
        .limit(limit);

      if (tracksError) {
        throw new Error(tracksError.message);
      }

      // Check if user has Spotify connected
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('spotify_refresh_token, spotify_connected_at')
        .eq('id', profileId)
        .single();

      if (profileError) {
        console.warn('Could not check Spotify connection status:', profileError);
        setIsConnected(false);
      } else {
        setIsConnected(!!profileData?.spotify_refresh_token);
      }

      console.log('useSpotifyTracks - fetched tracks:', tracksData?.length, tracksData?.[0]);
      setTracks(tracksData || []);

    } catch (err) {
      console.error('Error fetching Spotify tracks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tracks');
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, [profileId, timeRange, limit]);

  const syncTracks = useCallback(async () => {
    if (!profileId) return;

    try {
      setError(null);

      // First try to refresh token
      const refreshResponse = await fetch('/api/spotify/refresh', {
        method: 'POST',
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh Spotify token');
      }

      const { access_token } = await refreshResponse.json();

      // Sync tracks
      const syncResponse = await fetch('/api/spotify/sync-tracks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeRange,
          limit,
        }),
      });

      if (!syncResponse.ok) {
        const errorData = await syncResponse.json();
        throw new Error(errorData.error || 'Failed to sync tracks');
      }

      // Refresh local data
      await fetchTracks();

    } catch (err) {
      console.error('Error syncing Spotify tracks:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync tracks');
    }
  }, [profileId, timeRange, limit, fetchTracks]);

  const refresh = useCallback(async () => {
    await fetchTracks();
  }, [fetchTracks]);

  // Initial fetch
  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  // Set up real-time updates
  useEffect(() => {
    if (!profileId || !autoRefresh) return;

    const channel = supabase
      .channel(`spotify-tracks-${profileId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profile_spotify_tracks',
          filter: `profile_id=eq.${profileId}`,
        },
        () => {
          fetchTracks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, autoRefresh, fetchTracks]);

  return {
    tracks,
    loading,
    error,
    isConnected,
    syncTracks,
    refresh,
  };
}