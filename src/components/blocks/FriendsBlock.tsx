"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { useFriendCount } from '@/hooks/useFriendCount';
import { PlatformIcon } from '@/components/PlatformIcon';
import { supabase } from '@/lib/supabaseClient';

interface Friend {
  friend_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  friendship_date: string;
}

interface FriendsBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
}

export function FriendsBlock({ block, profile, isEditing = false }: FriendsBlockProps) {
  const { themeClasses } = useTheme();
  const { friendCount, loading: friendCountLoading } = useFriendCount(profile?.id);
  const variant = block.variant || 'avatarGrid';
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch friends for the profile being viewed
  useEffect(() => {
    const fetchFriends = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Query the friend_requests table directly to get friends for this profile
        const { data: friendsData, error: friendsError } = await supabase
          .from('friend_requests')
          .select(`
            *,
            requester_profile:profiles!friend_requests_requester_fkey(id, username, display_name, avatar_url),
            recipient_profile:profiles!friend_requests_recipient_fkey(id, username, display_name, avatar_url)
          `)
          .eq('status', 'accepted')
          .or(`requester.eq.${profile.id},recipient.eq.${profile.id}`)
          .order('created_at', { ascending: false })
          .limit(12); // Limit to first 12 friends

        if (friendsError) {
          console.error('Error fetching friends:', friendsError);
          setError('Failed to load friends');
          setFriends([]);
        } else {
          // Transform friend_requests data into Friend objects
          const transformedFriends = (friendsData || []).map((request) => {
            // Determine which profile is the friend (not the current profile)
            const friendProfile = request.requester === profile.id 
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
        }
      } catch (err) {
        console.error('Unexpected error fetching friends:', err);
        setError('Failed to load friends');
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [profile?.id]);

  const renderCompactList = () => (
    <div className="space-y-3">
      {friends.slice(0, 5).map((friend) => (
        <Link key={friend.friend_id} href={`/${friend.username}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden">
            {friend.avatar_url ? (
              <Image
                src={friend.avatar_url}
                alt={friend.display_name}
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className={`text-sm font-bold ${themeClasses.textPrimary}`}>
                {friend.display_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="text-white font-medium">{friend.display_name}</div>
            <div className="text-gray-400 text-sm">@{friend.username}</div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderAvatarGrid = () => (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
      {friends.map((friend) => (
        <Link key={friend.friend_id} href={`/${friend.username}`} className="group">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center ${themeClasses.hoverAccent} transition-all duration-200 group-hover:scale-110 overflow-hidden`}>
            {friend.avatar_url ? (
              <Image
                src={friend.avatar_url}
                alt={friend.display_name}
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className={`text-sm font-bold ${themeClasses.textPrimary}`}>
                {friend.display_name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400 text-center mt-1 truncate group-hover:text-white transition-colors">
            {friend.username}
          </div>
        </Link>
      ))}
    </div>
  );

  const renderFeaturedFriends = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {friends.slice(0, 6).map((friend) => (
        <Link key={friend.friend_id} href={`/${friend.username}`} className={`${themeClasses.cardBg} rounded-lg p-4 ${themeClasses.hoverAccent} transition-all duration-200 hover:scale-105`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden">
              {friend.avatar_url ? (
                <Image
                  src={friend.avatar_url}
                  alt={friend.display_name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className={`text-sm font-bold ${themeClasses.textPrimary}`}>
                  {friend.display_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="text-white font-medium">{friend.display_name}</div>
              <div className="text-gray-400 text-sm">@{friend.username}</div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Friends since {new Date(friend.friendship_date).toLocaleDateString()}</span>
            <span>Friend</span>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>{error}</p>
        </div>
      );
    }

    if (friends.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <PlatformIcon platform="users" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No friends yet</p>
          <p className="text-sm">This user hasn't added any friends to their profile</p>
        </div>
      );
    }

    switch (variant) {
      case 'compactList':
        return renderCompactList();
      case 'featuredFriends':
        return renderFeaturedFriends();
      case 'avatarGrid':
      default:
        return renderAvatarGrid();
    }
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 relative`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platform="users" className={`w-6 h-6 ${themeClasses.textPrimary}`} />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Friends
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({friendCountLoading ? '...' : friendCount})
            </span>
          </h3>
        </div>
        <Link href="/friends" className={`text-sm ${themeClasses.textPrimary} ${themeClasses.hoverAccent} transition-colors`}>
          View All
        </Link>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Edit indicator */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          Friends Block - {variant}
        </div>
      )}
    </div>
  );
}