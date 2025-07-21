"use client";

import React from 'react';
import Link from 'next/link';
import { useFriends } from '@/hooks/useFriends';

export default function FriendList() {
  const { friends, loading, error } = useFriends();

  if (loading) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Friends</h3>
        <div className="text-center text-gray-400 text-sm">Loading friends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Friends</h3>
        <div className="text-center text-red-400 text-sm">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
        Friends {friends.length > 0 && `(${friends.length})`}
      </h3>
      
      {friends.length === 0 ? (
        <div className="text-center text-gray-400 py-6 sm:py-8">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <p className="text-base sm:text-lg mb-1 sm:mb-2">No friends yet</p>
          <p className="text-xs sm:text-sm">Search for users to add your first friends!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
          {friends.map((friend) => (
            <Link
              key={friend.friend_id}
              href={`/${friend.username}`}
              className="group block p-3 sm:p-4 bg-gray-800/50 hover:bg-gray-800/80 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-neon-green/50"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {friend.avatar_url ? (
                  <img
                    src={friend.avatar_url}
                    alt={friend.display_name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-neon-green object-cover group-hover:border-neon-green/80 transition-colors flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-neon-green bg-gray-700 flex items-center justify-center group-hover:border-neon-green/80 transition-colors flex-shrink-0">
                    <span className="text-neon-green font-bold text-sm sm:text-lg">
                      {friend.display_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm sm:text-base truncate group-hover:text-neon-green transition-colors">
                    {friend.display_name}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm truncate">
                    @{friend.username}
                  </div>
                  <div className="text-gray-500 text-xs mt-1 hidden sm:block">
                    Friends since {new Date(friend.friendship_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 