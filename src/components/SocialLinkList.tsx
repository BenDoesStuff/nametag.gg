"use client";

import React, { useState } from 'react';
import { PlatformIcon } from './PlatformIcon';
import { 
  SocialLinks, 
  PLATFORM_LABELS, 
  getPlatformUrl,
  SupportedPlatform 
} from '@/hooks/useSocialLinks';

interface SocialLinkListProps {
  socialLinks: SocialLinks;
  onRemoveLink: (platform: string) => Promise<boolean>;
  loading?: boolean;
  editable?: boolean;
}

export const SocialLinkList: React.FC<SocialLinkListProps> = ({
  socialLinks,
  onRemoveLink,
  loading = false,
  editable = true
}) => {
  const [removingPlatform, setRemovingPlatform] = useState<string | null>(null);

  const handleRemove = async (platform: string) => {
    setRemovingPlatform(platform);
    try {
      await onRemoveLink(platform);
    } finally {
      setRemovingPlatform(null);
    }
  };

  const linkEntries = Object.entries(socialLinks).filter(([_, value]) => value.trim() !== '');

  if (linkEntries.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
            </svg>
          </div>
          <p className="text-lg mb-2">No social accounts added</p>
          <p className="text-sm">Add your gaming and social platforms to connect with other players!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700">
      <h4 className="text-lg font-semibold text-white mb-4">
        Connected Accounts ({linkEntries.length})
      </h4>
      
      <div className="space-y-3">
        {linkEntries.map(([platform, value]) => {
          const platformKey = platform as SupportedPlatform;
          const platformLabel = PLATFORM_LABELS[platformKey] || platform;
          const isRemoving = removingPlatform === platform;
          
          return (
            <div
              key={platform}
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Platform Icon */}
                <div className="flex-shrink-0">
                  <PlatformIcon 
                    platform={platform} 
                    className="w-6 h-6 text-green-400" 
                    size={24} 
                  />
                </div>
                
                {/* Platform Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm sm:text-base">
                      {platformLabel}
                    </span>
                    
                    {/* External Link Button */}
                    {!editable && (
                      <a
                        href={getPlatformUrl(platformKey, value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-400 transition-colors"
                        title={`Visit ${platformLabel}`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                      </a>
                    )}
                  </div>
                  
                  <div className="text-gray-400 text-sm truncate">
                    {value}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {/* Visit Link Button (Edit Mode) */}
                {editable && (
                  <a
                    href={getPlatformUrl(platformKey, value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                    title={`Visit ${platformLabel}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                )}
                
                {/* Remove Button (Edit Mode Only) */}
                {editable && (
                  <button
                    onClick={() => handleRemove(platform)}
                    disabled={loading || isRemoving}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Remove ${platformLabel}`}
                  >
                    {isRemoving ? (
                      <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform Statistics */}
      {linkEntries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex flex-wrap gap-2">
            {linkEntries.map(([platform]) => (
              <div
                key={platform}
                className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
              >
                <PlatformIcon 
                  platform={platform} 
                  className="w-3 h-3" 
                  size={12} 
                />
                <span>{PLATFORM_LABELS[platform as SupportedPlatform] || platform}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinkList;