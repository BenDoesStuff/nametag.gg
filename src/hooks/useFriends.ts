"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Friend {
  friend_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  friendship_date: string;
}

export interface PendingRequest {
  id: string;
  requester: string;
  recipient: string;
  status: string;
  created_at: string;
  requester_profile?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  recipient_profile?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface SearchUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  friendStatus: 'none' | 'friends' | 'request_sent' | 'request_received';
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      
      // Use Supabase client directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // For now, return empty friends list if not authenticated
        // In production, this would be handled differently
        setFriends([]);
        setError(null);
        setLoading(false);
        return;
      }

      // Query the friend_requests table directly to get friends for the authenticated user
      const { data: friendsData, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          requester_profile:profiles!friend_requests_requester_fkey(id, username, display_name, avatar_url),
          recipient_profile:profiles!friend_requests_recipient_fkey(id, username, display_name, avatar_url)
        `)
        .eq('status', 'accepted')
        .or(`requester.eq.${user.id},recipient.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform friend_requests data into Friend objects
      const transformedFriends = (friendsData || []).map((request) => {
        // Determine which profile is the friend (not the current user)
        const friendProfile = request.requester === user.id 
          ? request.recipient_profile 
          : request.requester_profile;
        
        return {
          friend_id: friendProfile.id,
          username: friendProfile.username,
          display_name: friendProfile.display_name,
          avatar_url: friendProfile.avatar_url,
          friendship_date: request.created_at
        };
      });
      
      setFriends(transformedFriends);
      setError(null);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch friends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return {
    friends,
    loading,
    error,
    refetch: fetchFriends
  };
}

export function usePendingRequests() {
  const [incoming, setIncoming] = useState<PendingRequest[]>([]);
  const [outgoing, setOutgoing] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      
      // Use Supabase client directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Get incoming pending requests (where user is recipient)
      const { data: incomingRequests, error: incomingError } = await supabase
        .from('friend_requests')
        .select(`
          *,
          requester_profile:profiles!friend_requests_requester_fkey(
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('recipient', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      // Get outgoing pending requests (where user is requester)
      const { data: outgoingRequests, error: outgoingError } = await supabase
        .from('friend_requests')
        .select(`
          *,
          recipient_profile:profiles!friend_requests_recipient_fkey(
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('requester', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (incomingError || outgoingError) {
        throw new Error(incomingError?.message || outgoingError?.message || 'Failed to fetch pending requests');
      }
      
      setIncoming(incomingRequests || []);
      setOutgoing(outgoingRequests || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pending requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return {
    incoming,
    outgoing,
    loading,
    error,
    refetch: fetchPendingRequests
  };
}

export function useUserSearch() {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsers = async (query: string) => {
    if (!query || query.length < 2) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      
      // Use Supabase client directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Search users by username or display name (case-insensitive)
      const searchTerm = query.toLowerCase().trim();
      
      const { data: users, error: searchError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`)
        .neq('id', user.id) // Exclude current user
        .limit(20)
        .order('username');

      if (searchError) {
        throw new Error(searchError.message);
      }

      // Get friend status for each user
      const userIds = users?.map(u => u.id) || [];
      
      const friendStatuses: Record<string, string> = {};
      
      if (userIds.length > 0) {
        const { data: friendRequests } = await supabase
          .from('friend_requests')
          .select('requester, recipient, status')
          .or(
            userIds.map(id => 
              `and(requester.eq.${user.id},recipient.eq.${id}),and(requester.eq.${id},recipient.eq.${user.id})`
            ).join(',')
          );

        friendRequests?.forEach(request => {
          const otherUserId = request.requester === user.id ? request.recipient : request.requester;
          
          if (request.status === 'accepted') {
            friendStatuses[otherUserId] = 'friends';
          } else if (request.status === 'pending') {
            if (request.requester === user.id) {
              friendStatuses[otherUserId] = 'request_sent';
            } else {
              friendStatuses[otherUserId] = 'request_received';
            }
          }
        });
      }

      // Add friend status to each user
      const usersWithStatus = users?.map(user => ({
        ...user,
        friendStatus: friendStatuses[user.id] || 'none'
      }));
      
      setUsers(usersWithStatus || []);
      setError(null);
    } catch (err) {
      console.error('Error searching users:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    searchUsers,
    setUsers
  };
}

export function useFriendActions() {
  const [loading, setLoading] = useState(false);

  const sendFriendRequest = async (recipientUsername: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Use Supabase client directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Find recipient by username
      const { data: recipient, error: recipientError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', recipientUsername.toLowerCase())
        .single();

      if (recipientError || !recipient) {
        throw new Error('User not found');
      }

      // Prevent self-friend requests
      if (recipient.id === user.id) {
        throw new Error('Cannot send friend request to yourself');
      }

      // Check if request already exists (in any direction)
      const { data: existingRequest } = await supabase
        .from('friend_requests')
        .select('id, status, requester, recipient')
        .or(`and(requester.eq.${user.id},recipient.eq.${recipient.id}),and(requester.eq.${recipient.id},recipient.eq.${user.id})`)
        .neq('status', 'declined')
        .single();

      if (existingRequest) {
        if (existingRequest.status === 'accepted') {
          throw new Error('You are already friends with this user');
        }
        throw new Error('Friend request already exists');
      }

      // Create friend request
      const { error: insertError } = await supabase
        .from('friend_requests')
        .insert({
          requester: user.id,
          recipient: recipient.id,
          status: 'pending'
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      return true;
    } catch (err) {
      console.error('Error sending friend request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Use Supabase client directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Update request status to accepted
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .eq('recipient', user.id)
        .eq('status', 'pending');

      if (updateError) {
        throw new Error(updateError.message);
      }

      return true;
    } catch (err) {
      console.error('Error accepting friend request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const declineFriendRequest = async (requestId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Use Supabase client directly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Update request status to declined
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'declined' })
        .eq('id', requestId)
        .eq('recipient', user.id)
        .eq('status', 'pending');

      if (updateError) {
        throw new Error(updateError.message);
      }

      return true;
    } catch (err) {
      console.error('Error declining friend request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest
  };
}