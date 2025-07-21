"use client";

import React, { useState, useEffect } from 'react';
import { useUserSearch, useFriendActions, type SearchUser } from '@/hooks/useFriends';

interface FriendSearchProps {
  onRequestSent?: () => void;
}

export default function FriendSearch({ onRequestSent }: FriendSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { users, loading: searchLoading, searchUsers, setUsers } = useUserSearch();
  const { loading: actionLoading, sendFriendRequest } = useFriendActions();

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchUsers]);

  const handleSendRequest = async (user: SearchUser) => {
    try {
      await sendFriendRequest(user.username);
      
      // Optimistically update the user's status in the current results
      setUsers(prev => prev.map(u => 
        u.id === user.id 
          ? { ...u, friendStatus: 'request_sent' as const }
          : u
      ));
      
      onRequestSent?.();
    } catch (error) {
      console.error('Failed to send friend request:', error);
      // Revert the optimistic update on error
      searchUsers(query);
    }
  };

  const getFriendStatusButton = (user: SearchUser) => {
    const baseClasses = "px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors";
    
    switch (user.friendStatus) {
      case 'friends':
        return (
          <span className={`${baseClasses} bg-green-600 text-white cursor-default`}>
            <span className="hidden sm:inline">Friends</span>
            <span className="sm:hidden">✓</span>
          </span>
        );
      case 'request_sent':
        return (
          <span className={`${baseClasses} bg-yellow-600 text-white cursor-default`}>
            <span className="hidden sm:inline">Pending</span>
            <span className="sm:hidden">⏳</span>
          </span>
        );
      case 'request_received':
        return (
          <span className={`${baseClasses} bg-blue-600 text-white cursor-default`}>
            <span className="hidden sm:inline">Accept Request</span>
            <span className="sm:hidden">Accept</span>
          </span>
        );
      default:
        return (
          <button
            onClick={() => handleSendRequest(user)}
            disabled={actionLoading}
            className={`${baseClasses} border-2 border-neon-green text-white hover:bg-neon-green hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="hidden sm:inline">{actionLoading ? 'Sending...' : 'Add Friend'}</span>
            <span className="sm:hidden">{actionLoading ? '...' : '+'}</span>
          </button>
        );
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for friends by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-neon-green outline-none"
        />
        <svg 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 sm:max-h-80 overflow-y-auto">
          {searchLoading ? (
            <div className="p-3 sm:p-4 text-center text-gray-400 text-sm">
              Searching...
            </div>
          ) : users.length === 0 ? (
            <div className="p-3 sm:p-4 text-center text-gray-400 text-sm">
              {query.length < 2 ? 'Type at least 2 characters to search' : 'No users found'}
            </div>
          ) : (
            <div className="py-1 sm:py-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neon-green object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neon-green bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-neon-green font-bold text-xs sm:text-sm">
                          {user.display_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium text-sm sm:text-base truncate">{user.display_name}</div>
                      <div className="text-gray-400 text-xs sm:text-sm truncate">@{user.username}</div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    {getFriendStatusButton(user)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}