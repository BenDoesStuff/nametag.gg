"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface UseFriendCountReturn {
  friendCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFriendCount(userId: string): UseFriendCountReturn {
  const [friendCount, setFriendCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendCount = async () => {
    if (!userId) {
      setFriendCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try using the database function first
      const { data, error: rpcError } = await supabase
        .rpc('get_user_friend_count', { target_user_id: userId });

      if (rpcError) {
        // If RPC fails, fall back to manual counting
        console.warn('RPC failed, falling back to manual count:', rpcError.message);
        
        const { data: friendRequests, error: countError } = await supabase
          .from('friend_requests')
          .select('id')
          .eq('status', 'accepted')
          .or(`requester.eq.${userId},recipient.eq.${userId}`);

        if (countError) {
          throw new Error(countError.message);
        }

        setFriendCount(friendRequests?.length || 0);
      } else {
        setFriendCount(data || 0);
      }
    } catch (err) {
      console.error('Error fetching friend count:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch friend count');
      setFriendCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendCount();
  }, [userId]);

  return {
    friendCount,
    loading,
    error,
    refetch: fetchFriendCount,
  };
}

// Alternative hook that works with username instead of userId
export function useFriendCountByUsername(username: string): UseFriendCountReturn {
  const [friendCount, setFriendCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriendCountByUsername = async () => {
    if (!username) {
      setFriendCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First get the user ID from username
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (profileError || !profile) {
        throw new Error('User not found');
      }

      // Then get friend count
      const { data, error: rpcError } = await supabase
        .rpc('get_user_friend_count', { target_user_id: profile.id });

      if (rpcError) {
        // Fall back to manual counting
        const { data: friendRequests, error: countError } = await supabase
          .from('friend_requests')
          .select('id')
          .eq('status', 'accepted')
          .or(`requester.eq.${profile.id},recipient.eq.${profile.id}`);

        if (countError) {
          throw new Error(countError.message);
        }

        setFriendCount(friendRequests?.length || 0);
      } else {
        setFriendCount(data || 0);
      }
    } catch (err) {
      console.error('Error fetching friend count by username:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch friend count');
      setFriendCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendCountByUsername();
  }, [username]);

  return {
    friendCount,
    loading,
    error,
    refetch: fetchFriendCountByUsername,
  };
}