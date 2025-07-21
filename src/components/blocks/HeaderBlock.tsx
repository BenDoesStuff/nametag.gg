"use client";

import React from 'react';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { CompactNowPlayingIndicator } from '@/components/NowPlayingIndicator';

interface HeaderBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
}

export function HeaderBlock({ block, profile, isEditing = false }: HeaderBlockProps) {
  const { themeClasses } = useTheme();

  if (!profile) return null;

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
      {/* Banner Section */}
      <div className="relative h-32 sm:h-40 md:h-48 lg:h-64 w-full">
        {profile.banner_url ? (
          <img 
            src={profile.banner_url} 
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
      </div>

      {/* Profile Content */}
      <div className="p-4 sm:p-6 md:p-8 relative">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 -mt-12 sm:-mt-16 md:-mt-20">
          {/* Avatar */}
          <div className="flex-shrink-0 z-10">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.display_name}
                className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 ${themeClasses.borderPrimary} object-cover shadow-xl bg-gray-900`}
              />
            ) : (
              <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 ${themeClasses.borderPrimary} bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center shadow-xl`}>
                <span className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${themeClasses.textPrimary}`}>
                  {profile.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        
          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left md:mt-12 lg:mt-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {profile.display_name}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3 sm:mb-4">
              <p className={`${themeClasses.textPrimary} text-base sm:text-lg md:text-xl font-medium`}>
                @{profile.username}
              </p>
              <CompactNowPlayingIndicator 
                userId={profile.id} 
                showTooltip={true}
                className="opacity-90"
              />
            </div>
            
            {profile.bio && (
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}
            
            <div className="flex flex-col md:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="break-words">Member since {new Date(profile.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit indicator */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          Header Block
        </div>
      )}
    </div>
  );
}