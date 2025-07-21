"use client";

import React from 'react';
import { usePendingRequests, useFriendActions } from '@/hooks/useFriends';

interface FriendRequestsProps {
  onRequestHandled?: () => void;
}

export default function FriendRequests({ onRequestHandled }: FriendRequestsProps) {
  const { incoming, outgoing, loading, refetch } = usePendingRequests();
  const { loading: actionLoading, acceptFriendRequest, declineFriendRequest } = useFriendActions();

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      refetch();
      onRequestHandled?.();
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      refetch();
      onRequestHandled?.();
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50">
        <div className="text-center text-gray-400 text-sm">Loading requests...</div>
      </div>
    );
  }

  if (incoming.length === 0 && outgoing.length === 0) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Friend Requests</h3>
        <div className="text-center text-gray-400 text-sm">No pending requests</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 space-y-4 sm:space-y-6">
      <h3 className="text-lg sm:text-xl font-bold text-white">Friend Requests</h3>

      {/* Incoming Requests */}
      {incoming.length > 0 && (
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-neon-green mb-2 sm:mb-3">
            Incoming ({incoming.length})
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {incoming.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-lg gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {request.requester_profile?.avatar_url ? (
                    <img
                      src={request.requester_profile.avatar_url}
                      alt={request.requester_profile.display_name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neon-green object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neon-green bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-neon-green font-bold text-xs sm:text-sm">
                        {request.requester_profile?.display_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium text-sm sm:text-base truncate">
                      {request.requester_profile?.display_name}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm truncate">
                      @{request.requester_profile?.username}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAccept(request.id)}
                    disabled={actionLoading}
                    className="px-2 sm:px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(request.id)}
                    disabled={actionLoading}
                    className="px-2 sm:px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outgoing Requests */}
      {outgoing.length > 0 && (
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-yellow-400 mb-2 sm:mb-3">
            Sent ({outgoing.length})
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {outgoing.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-800/50 rounded-lg gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {request.recipient_profile?.avatar_url ? (
                    <img
                      src={request.recipient_profile.avatar_url}
                      alt={request.recipient_profile.display_name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neon-green object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-neon-green bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-neon-green font-bold text-xs sm:text-sm">
                        {request.recipient_profile?.display_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-medium text-sm sm:text-base truncate">
                      {request.recipient_profile?.display_name}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm truncate">
                      @{request.recipient_profile?.username}
                    </div>
                  </div>
                </div>
                <span className="px-2 sm:px-3 py-1 bg-yellow-600 text-white rounded text-xs sm:text-sm flex-shrink-0">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}