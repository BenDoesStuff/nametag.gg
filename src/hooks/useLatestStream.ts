"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface StreamData {
  stream_platform?: 'twitch' | 'youtube';
  stream_channel?: string;
  stream_last_title?: string;
  stream_last_thumbnail?: string;
}

export interface StreamInfo {
  isLive: boolean;
  title?: string;
  thumbnail?: string;
  viewerCount?: number;
  startedAt?: string;
}

export function useLatestStream(profileId?: string) {
  const [streamData, setStreamData] = useState<StreamData>({});
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreamData = async () => {
    if (!profileId) {
      setStreamData({});
      setStreamInfo(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('stream_platform, stream_channel, stream_last_title, stream_last_thumbnail')
        .eq('id', profileId)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      const streamData = {
        stream_platform: profileData?.stream_platform,
        stream_channel: profileData?.stream_channel,
        stream_last_title: profileData?.stream_last_title,
        stream_last_thumbnail: profileData?.stream_last_thumbnail
      };

      setStreamData(streamData);

      // Fetch live stream info if platform and channel are available
      if (streamData.stream_platform && streamData.stream_channel) {
        await fetchLiveStreamInfo(streamData.stream_platform, streamData.stream_channel);
      } else {
        setStreamInfo(null);
      }
    } catch (err) {
      console.error('Error fetching stream data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stream data');
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveStreamInfo = async (platform: 'twitch' | 'youtube', channel: string) => {
    try {
      // Note: In a real implementation, you would need to:
      // 1. Set up API keys for Twitch/YouTube APIs
      // 2. Create serverless functions or API routes to handle these requests
      // 3. Implement proper error handling and rate limiting
      
      // For now, we'll simulate the API call and return mock data
      // In production, this would call your API routes that interact with Twitch/YouTube APIs
      
      const response = await fetch(`/api/stream-status?platform=${platform}&channel=${channel}`);
      
      if (!response.ok) {
        // If API route doesn't exist or fails, set to not live
        setStreamInfo({ isLive: false });
        return;
      }

      const data = await response.json();
      setStreamInfo(data);
    } catch (err) {
      console.error('Error fetching live stream info:', err);
      // Don't throw error here, just set as not live
      setStreamInfo({ isLive: false });
    }
  };

  const updateStreamData = async (updates: Partial<StreamData>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Verify user owns this profile
      if (profileId !== user.id) {
        throw new Error('Unauthorized');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select('stream_platform, stream_channel, stream_last_title, stream_last_thumbnail')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setStreamData({
        stream_platform: data.stream_platform,
        stream_channel: data.stream_channel,
        stream_last_title: data.stream_last_title,
        stream_last_thumbnail: data.stream_last_thumbnail
      });

      return data;
    } catch (err) {
      console.error('Error updating stream data:', err);
      throw err;
    }
  };

  const getStreamUrl = () => {
    if (!streamData.stream_platform || !streamData.stream_channel) return null;
    
    switch (streamData.stream_platform) {
      case 'twitch':
        return `https://player.twitch.tv/?channel=${streamData.stream_channel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`;
      case 'youtube':
        // For YouTube, we'd need the actual video ID for live streams
        // This would typically come from the YouTube API
        return `https://www.youtube.com/embed/live_stream?channel=${streamData.stream_channel}`;
      default:
        return null;
    }
  };

  const getChannelUrl = () => {
    if (!streamData.stream_platform || !streamData.stream_channel) return null;
    
    switch (streamData.stream_platform) {
      case 'twitch':
        return `https://twitch.tv/${streamData.stream_channel}`;
      case 'youtube':
        return `https://youtube.com/@${streamData.stream_channel}`;
      default:
        return null;
    }
  };

  const refreshStreamInfo = async () => {
    if (streamData.stream_platform && streamData.stream_channel) {
      await fetchLiveStreamInfo(streamData.stream_platform, streamData.stream_channel);
    }
  };

  useEffect(() => {
    fetchStreamData();
  }, [profileId]);

  // Auto-refresh stream info every 2 minutes if there's stream data
  useEffect(() => {
    if (!streamData.stream_platform || !streamData.stream_channel) return;

    const interval = setInterval(() => {
      refreshStreamInfo();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [streamData.stream_platform, streamData.stream_channel]);

  return {
    streamData,
    streamInfo,
    loading,
    error,
    updateStreamData,
    getStreamUrl,
    getChannelUrl,
    refreshStreamInfo,
    refetch: fetchStreamData
  };
}