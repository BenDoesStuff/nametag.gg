"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { PlatformIcon } from '@/components/PlatformIcon';
import { SocialLinkForm } from '@/components/SocialLinkForm';
import { 
  SocialLinks, 
  PLATFORM_LABELS, 
  getPlatformUrl,
  SupportedPlatform,
  useSocialLinks
} from '@/hooks/useSocialLinks';

interface AccountsBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
}

export function AccountsBlock({ block, profile, isEditing = false }: AccountsBlockProps) {
  const { themeClasses } = useTheme();
  const variant = block.variant || 'grid';
  const [showAddForm, setShowAddForm] = useState(false);

  // Use the social links hook for real-time data when editing
  const { 
    socialLinks: liveSocialLinks, 
    loading: socialLinksLoading, 
    updateSocialLink, 
    refetch 
  } = useSocialLinks();

  // Get social links from live data when editing, or profile data when viewing
  const socialLinks: SocialLinks = isEditing 
    ? liveSocialLinks 
    : (profile?.social_links || {
        steam: 'steamuser123',
        discord: 'gamer#1234',
        xbox: 'XboxGamer',
        twitch: 'streamer_name',
        github: 'developer123',
        youtube: '@gamingchannel'
      });

  const linkEntries = Object.entries(socialLinks).filter(([_, value]) => 
    value && typeof value === 'string' && value.trim() !== ''
  );

  const handleAddLink = async (platform: string, value: string): Promise<boolean> => {
    try {
      const success = await updateSocialLink(platform, value);
      if (success) {
        refetch(); // Refresh the data
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding social link:', error);
      return false;
    }
  };

  const renderGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {linkEntries.map(([platform, value]) => {
        const platformKey = platform as SupportedPlatform;
        const platformLabel = PLATFORM_LABELS[platformKey] || platform;
        const platformUrl = getPlatformUrl(platformKey, value);

        return (
          <a
            key={platform}
            href={platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${themeClasses.cardBg} rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 ${themeClasses.hoverAccent} transition-all duration-200 hover:scale-105 group`}
            title={`Visit ${platformLabel}: ${value}`}
          >
            <div className="text-center">
              <div className="mb-3">
                <PlatformIcon 
                  platform={platform as any} 
                  className={`w-8 h-8 mx-auto ${themeClasses.textPrimary} group-hover:scale-110 transition-transform duration-200`} 
                />
              </div>
              <div className="text-white font-medium text-sm mb-1">{platformLabel}</div>
              <div className="text-gray-400 text-xs truncate">{value}</div>
            </div>
          </a>
        );
      })}
    </div>
  );

  const renderList = () => (
    <div className="space-y-3">
      {linkEntries.map(([platform, value]) => {
        const platformKey = platform as SupportedPlatform;
        const platformLabel = PLATFORM_LABELS[platformKey] || platform;
        const platformUrl = getPlatformUrl(platformKey, value);

        return (
          <a
            key={platform}
            href={platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${themeClasses.cardBg} rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 group flex items-center gap-4`}
            title={`Visit ${platformLabel}: ${value}`}
          >
            <div className="flex-shrink-0">
              <PlatformIcon 
                platform={platform as any} 
                className={`w-6 h-6 ${themeClasses.textPrimary} group-hover:scale-110 transition-transform duration-200`} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium mb-1">{platformLabel}</div>
              <div className="text-gray-400 text-sm truncate">{value}</div>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </div>
          </a>
        );
      })}
    </div>
  );

  const renderCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {linkEntries.map(([platform, value]) => {
        const platformKey = platform as SupportedPlatform;
        const platformLabel = PLATFORM_LABELS[platformKey] || platform;
        const platformUrl = getPlatformUrl(platformKey, value);

        return (
          <a
            key={platform}
            href={platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${themeClasses.cardBg} rounded-lg p-6 border border-gray-700/50 hover:border-gray-600/50 ${themeClasses.hoverAccent} transition-all duration-200 hover:scale-105 group`}
            title={`Visit ${platformLabel}: ${value}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-gray-800/50 rounded-lg">
                <PlatformIcon 
                  platform={platform as any} 
                  className={`w-8 h-8 ${themeClasses.textPrimary} group-hover:scale-110 transition-transform duration-200`} 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-lg mb-2">{platformLabel}</h4>
                <p className="text-gray-400 text-sm mb-3 truncate">{value}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Connected Account</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );

  const renderContent = () => {
    if (linkEntries.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
          </svg>
          <p className="text-lg mb-2">No connected accounts</p>
          <p className="text-sm">Add your gaming and social platforms to connect with other players!</p>
        </div>
      );
    }

    switch (variant) {
      case 'list':
        return renderList();
      case 'cards':
        return renderCards();
      case 'grid':
      default:
        return renderGrid();
    }
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 relative`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platform="link" className={`w-6 h-6 ${themeClasses.textPrimary}`} />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Connected Accounts
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({linkEntries.length})
            </span>
          </h3>
        </div>
        
        {/* Add Account Button - Only visible when editing */}
        {isEditing && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 relative z-50 ${
              showAddForm 
                ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700' 
                : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700'
            }`}
            title={showAddForm ? 'Cancel' : 'Add connected account'}
          >
            {showAddForm ? (
              <>
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4v16m8-8H4"/>
                </svg>
                Add Account
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {renderContent()}

      {/* Add Account Form - Only visible when editing and form is shown */}
      {isEditing && showAddForm && (
        <div className="mt-6">
          <SocialLinkForm
            onAddLink={handleAddLink}
            existingPlatforms={Object.keys(socialLinks)}
            loading={socialLinksLoading}
          />
        </div>
      )}

      {/* Platform Statistics */}
      {linkEntries.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex flex-wrap gap-2">
            {linkEntries.map(([platform]) => (
              <div
                key={platform}
                className="flex items-center gap-1 px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300 border border-gray-600/50"
              >
                <PlatformIcon 
                  platform={platform as any} 
                  className="w-3 h-3" 
                />
                <span>{PLATFORM_LABELS[platform as SupportedPlatform] || platform}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit indicator */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          Accounts Block - {variant}
        </div>
      )}
    </div>
  );
}