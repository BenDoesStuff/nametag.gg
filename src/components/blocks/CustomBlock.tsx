"use client";

import React from 'react';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';

interface CustomBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
}

interface CustomBlockConfig {
  title?: string;
  content?: string;
  contentType?: 'text' | 'html' | 'markdown';
}

export function CustomBlock({ block, profile, isEditing = false }: CustomBlockProps) {
  const { themeClasses } = useTheme();
  
  // Get configuration from block config
  const config: CustomBlockConfig = block.config || {};
  const {
    title = 'Custom Block',
    content = 'This is a custom text block. You can add any content here!',
    contentType = 'text'
  } = config;

  const renderContent = () => {
    if (!content || content.trim() === '') {
      return (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <p className="text-lg mb-2">Empty Custom Block</p>
          <p className="text-sm">Add content to personalize your profile</p>
        </div>
      );
    }

    switch (contentType) {
      case 'html':
        return (
          <div 
            className="prose prose-invert prose-sm max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      
      case 'markdown':
        // For now, render as plain text. In a full implementation, you'd use a markdown parser
        return (
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">
            {content}
          </div>
        );
      
      case 'text':
      default:
        return (
          <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        );
    }
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 relative`}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
          {contentType !== 'text' && (
            <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded uppercase">
              {contentType}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="custom-block-content">
        {renderContent()}
      </div>

      {/* Edit indicator */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs">
          Custom Block - {contentType}
        </div>
      )}
    </div>
  );
}