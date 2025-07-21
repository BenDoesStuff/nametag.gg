/**
 * Hook for fetching user's currently playing Spotify track
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface NowPlayingTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  externalUrl: string | null;
  previewUrl: string | null;
  durationMs: number;
  progressMs: number | null;
}

export interface NowPlayingState {
  isPlaying: boolean;
  track: NowPlayingTrack | null;
  timestamp: number;
  message?: string;
}

interface UseNowPlayingOptions {
  /** Polling interval in milliseconds (default: 30000 = 30 seconds) */
  pollInterval?: number;
  /** Whether to automatically start polling (default: true) */
  autoStart?: boolean;
  /** Whether to pause polling when tab is not visible (default: true) */
  pauseWhenHidden?: boolean;
  /** Whether to only poll when user is authenticated (default: true) */
  requireAuth?: boolean;
}

interface UseNowPlayingReturn {
  nowPlaying: NowPlayingState | null;
  loading: boolean;
  error: string | null;
  isPolling: boolean;
  startPolling: () => void;
  stopPolling: () => void;
  refresh: () => Promise<void>;
}

export function useNowPlaying(
  userId?: string,
  options: UseNowPlayingOptions = {}
): UseNowPlayingReturn {
  const {
    pollInterval = 30000, // 30 seconds
    autoStart = true,
    pauseWhenHidden = true,
    requireAuth = true,
  } = options;

  const [nowPlaying, setNowPlaying] = useState<NowPlayingState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchNowPlaying = useCallback(async (signal?: AbortSignal) => {
    try {
      setError(null);

      // Build URL with userId parameter if provided
      const url = new URL('/api/spotify/now-playing', window.location.origin);
      if (userId) {
        url.searchParams.set('userId', userId);
      }

      const response = await fetch(url.toString(), {
        signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        if (response.status === 401 && requireAuth) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Handle the response
      if (signal?.aborted) return;

      setNowPlaying({
        isPlaying: data.isPlaying || false,
        track: data.track || null,
        timestamp: data.timestamp || Date.now(),
        message: data.message,
      });

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled, ignore
      }

      console.error('Error fetching now playing:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch now playing');
      
      // Set empty state on error
      setNowPlaying({
        isPlaying: false,
        track: null,
        timestamp: Date.now(),
        message: err instanceof Error ? err.message : 'Error',
      });
    }
  }, [userId, requireAuth]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      await fetchNowPlaying(abortControllerRef.current.signal);
    } finally {
      setLoading(false);
    }
  }, [fetchNowPlaying]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return; // Already polling

    setIsPolling(true);
    
    // Initial fetch
    refresh();

    // Set up polling
    intervalRef.current = setInterval(() => {
      // Skip if document is hidden and pauseWhenHidden is enabled
      if (pauseWhenHidden && document.hidden) {
        return;
      }

      fetchNowPlaying();
    }, pollInterval);
  }, [refresh, fetchNowPlaying, pollInterval, pauseWhenHidden]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Handle visibility change
  useEffect(() => {
    if (!pauseWhenHidden || !isPolling) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became visible, refresh immediately
        fetchNowPlaying();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseWhenHidden, isPolling, fetchNowPlaying]);

  // Auto-start polling
  useEffect(() => {
    if (autoStart) {
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [autoStart, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    nowPlaying,
    loading,
    error,
    isPolling,
    startPolling,
    stopPolling,
    refresh,
  };
}

/**
 * Simplified hook that just returns the current playing state for display
 */
export function useSimpleNowPlaying(userId?: string) {
  const { nowPlaying } = useNowPlaying(userId, {
    pollInterval: 45000, // Poll less frequently for display-only usage
    pauseWhenHidden: true,
  });

  return {
    isPlaying: nowPlaying?.isPlaying || false,
    track: nowPlaying?.track || null,
  };
}