"use client";

import React from 'react';

interface VariantPreviewProps {
  blockType: string;
  variant: string;
  className?: string;
}

export function VariantPreview({ blockType, variant, className = '' }: VariantPreviewProps) {
  const renderPreview = () => {
    switch (blockType) {
      case 'friends':
        return renderFriendsPreview(variant);
      case 'games':
        return renderGamesPreview(variant);
      case 'achievements':
        return renderAchievementsPreview(variant);
      case 'accounts':
        return renderAccountsPreview(variant);
      case 'custom':
        return renderCustomPreview(variant);
      default:
        return renderDefaultPreview();
    }
  };

  const renderFriendsPreview = (variant: string) => {
    switch (variant) {
      case 'compactList':
        return (
          <div className="space-y-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <div className="flex-1 h-2 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        );
      case 'avatarGrid':
        return (
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="w-6 h-6 rounded-full bg-blue-500"></div>
            ))}
          </div>
        );
      case 'featuredFriends':
        return (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-700 rounded p-2">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="h-1.5 bg-gray-600 rounded flex-1"></div>
                </div>
                <div className="h-1 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        );
      default:
        return renderDefaultPreview();
    }
  };

  const renderGamesPreview = (variant: string) => {
    switch (variant) {
      case 'coverSmall':
        return (
          <div className="grid grid-cols-6 gap-1">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[3/4] bg-purple-600 rounded"></div>
            ))}
          </div>
        );
      case 'coverLarge':
        return (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-700 rounded">
                <div className="aspect-[3/4] bg-purple-600 rounded mb-1"></div>
                <div className="h-1.5 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        );
      case 'carousel':
        return (
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-8">
                <div className="aspect-[3/4] bg-purple-600 rounded mb-1"></div>
                <div className="h-1 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        );
      case 'showcase':
        return (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-2">
                <div className="w-8 h-10 bg-purple-600 rounded"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-gray-600 rounded"></div>
                  <div className="h-1.5 bg-gray-600 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return renderDefaultPreview();
    }
  };

  const renderAchievementsPreview = (variant: string) => {
    switch (variant) {
      case 'grid':
        return (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-700 rounded p-1 text-center">
                <div className="text-xs mb-1">🏆</div>
                <div className="h-1 bg-yellow-500 rounded"></div>
              </div>
            ))}
          </div>
        );
      case 'featured':
        return (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-2 bg-gray-700 rounded p-2">
                <div className="text-lg">🏆</div>
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-yellow-500 rounded"></div>
                  <div className="h-1.5 bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'stats':
        return (
          <div className="space-y-2">
            <div className="bg-gray-700 rounded p-2">
              <div className="h-1.5 bg-gray-600 rounded mb-2"></div>
              <div className="h-2 bg-yellow-500 rounded w-3/4"></div>
            </div>
            <div className="bg-gray-700 rounded p-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-1.5 bg-gray-600 rounded"></div>
                <div className="h-1.5 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        );
      default:
        return renderDefaultPreview();
    }
  };

  const renderAccountsPreview = (variant: string) => {
    switch (variant) {
      case 'grid':
        return (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-700 rounded p-2 text-center">
                <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
                <div className="h-1 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        );
      case 'list':
        return (
          <div className="space-y-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2 bg-gray-700 rounded p-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <div className="flex-1 h-1.5 bg-gray-600 rounded"></div>
                <div className="w-2 h-2 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        );
      case 'cards':
        return (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-700 rounded p-2">
                <div className="flex gap-2 mb-1">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <div className="flex-1 h-2 bg-gray-600 rounded"></div>
                </div>
                <div className="h-1.5 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        );
      default:
        return renderDefaultPreview();
    }
  };

  const renderCustomPreview = (variant: string) => {
    return (
      <div className="bg-gray-700 rounded p-3">
        <div className="h-2 bg-gray-600 rounded mb-2"></div>
        <div className="space-y-1">
          <div className="h-1.5 bg-gray-600 rounded"></div>
          <div className="h-1.5 bg-gray-600 rounded w-4/5"></div>
          <div className="h-1.5 bg-gray-600 rounded w-3/5"></div>
        </div>
      </div>
    );
  };

  const renderDefaultPreview = () => {
    return (
      <div className="bg-gray-700 rounded p-3 flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-600 rounded"></div>
      </div>
    );
  };

  return (
    <div className={`w-full h-20 bg-gray-800 rounded border-2 border-gray-600 p-2 ${className}`}>
      {renderPreview()}
    </div>
  );
}