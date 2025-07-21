"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import FriendSearch from '@/components/FriendSearch';
import FriendRequests from '@/components/FriendRequests';
import FriendList from '@/components/FriendList';

export default function FriendsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/login');
        return;
      }
      
      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-3 sm:p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            Friends
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg px-4">
            Connect with other gamers and build your network
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-6 sm:mb-8">
          <FriendSearch onRequestSent={handleRefresh} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Friend Requests */}
          <div key={`requests-${refreshKey}`}>
            <FriendRequests onRequestHandled={handleRefresh} />
          </div>

          {/* Right Column - Friends List */}
          <div key={`friends-${refreshKey}`}>
            <FriendList />
          </div>
        </div>
      </div>
    </main>
  );
}