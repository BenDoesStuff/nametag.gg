"use client";

import React from 'react';
import { ProfileBlock } from '@/types/layout';
import { HeaderBlock } from './HeaderBlock';
import { FriendsBlock } from './FriendsBlock';
import { GamesBlock } from './GamesBlock';
import { AchievementsBlock } from './AchievementsBlock';
import { AccountsBlock } from './AccountsBlock';
import { CustomBlock } from './CustomBlock';
import { AboutBlock } from './AboutBlock';
import { StreamBlock } from './StreamBlock';
import { RosterBlock } from './RosterBlock';
import { GalleryBlock } from './GalleryBlock';
import { SpotifyTracksBlock } from './SpotifyTracksBlock';

interface BlockRendererProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
  className?: string;
  onEdit?: (block: ProfileBlock) => void;
  onEditContent?: (block: ProfileBlock) => void;
  onDelete?: (blockId: string) => void;
}

export function BlockRenderer({ 
  block, 
  profile, 
  isEditing = false, 
  className = '',
  onEdit,
  onEditContent,
  onDelete 
}: BlockRendererProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(block);
    }
  };

  const handleEditContent = () => {
    if (onEditContent) {
      onEditContent(block);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(block.id);
    }
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'header':
        return (
          <HeaderBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing} 
          />
        );
      
      case 'friends':
        return (
          <FriendsBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing} 
          />
        );
      
      case 'games':
        return (
          <GamesBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing} 
          />
        );
      
      case 'achievements':
        return (
          <AchievementsBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing} 
          />
        );
      
      case 'accounts':
        return (
          <AccountsBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing} 
          />
        );
      
      case 'custom':
        return (
          <CustomBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing} 
          />
        );

      case 'about':
        return (
          <AboutBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );

      case 'stream':
        return (
          <StreamBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );

      case 'roster':
        return (
          <RosterBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );

      case 'gallery':
        return (
          <GalleryBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );

      case 'spotify-tracks':
        return (
          <SpotifyTracksBlock 
            block={block} 
            profile={profile} 
            isEditing={isEditing}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      
      default:
        // Fallback for unknown block types
        return (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <p className="text-lg mb-2">Unknown Block Type</p>
              <p className="text-sm">Block type "{block.type}" is not supported</p>
            </div>
            {isEditing && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                Unknown Block - {block.type}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {renderBlock()}
      
      {/* Edit controls overlay (only visible in edit mode) */}
      {isEditing && (onEdit || onEditContent || onDelete) && (
        <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEditContent && (
            <button
              onClick={handleEditContent}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-lg transition-colors duration-200"
              title="Edit block content"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-colors duration-200"
              title="Edit block style"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          )}
          
          {onDelete && block.type !== 'header' && (
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg transition-colors duration-200"
              title="Delete block"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}