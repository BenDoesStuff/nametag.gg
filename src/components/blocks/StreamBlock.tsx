"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { PlatformIcon } from '@/components/PlatformIcon';
import { supabase } from '@/lib/supabaseClient';

interface StreamData {
  stream_platform?: 'twitch' | 'youtube';
  stream_channel?: string;
  stream_last_title?: string;
  stream_last_thumbnail?: string;
  featured_video_url?: string;
  featured_video_title?: string;
}

interface StreamBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
  onEdit?: (block: ProfileBlock) => void;
  onDelete?: (blockId: string) => void;
  className?: string;
}

export function StreamBlock({ 
  block, 
  profile, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: StreamBlockProps) {
  const { themeClasses } = useTheme();
  const variant = block.variant || 'player';
  
  const [streamData, setStreamData] = useState<StreamData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stream data
  useEffect(() => {
    const fetchStreamData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // For now, just set empty stream data to avoid database errors
        // TODO: Add stream columns to database and enable proper fetching
        setStreamData({
          stream_platform: null,
          stream_channel: null,
          stream_last_title: null,
          stream_last_thumbnail: null,
          featured_video_url: null,
          featured_video_title: null
        });

      } catch (err) {
        console.error('Unexpected error fetching stream data:', err);
        setError('Failed to load stream data');
        setStreamData({});
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, [profile?.id]);

  const getStreamUrl = () => {
    if (!streamData.stream_platform || !streamData.stream_channel) return null;
    
    switch (streamData.stream_platform) {
      case 'twitch':
        return `https://player.twitch.tv/?channel=${streamData.stream_channel}&parent=${window.location.hostname}`;
      case 'youtube':
        // For YouTube, we'd need the actual video ID. For now, show the channel
        return `https://www.youtube.com/embed/live_stream?channel=${streamData.stream_channel}`;
      default:
        return null;
    }
  };

  const getChannelUrl = () => {
    if (!streamData.stream_platform || !streamData.stream_channel) return null;
    
    switch (streamData.stream_platform) {
      case 'twitch':
        return `https://twitch.tv/${streamData.stream_channel}`;
      case 'youtube':
        return `https://youtube.com/@${streamData.stream_channel}`;
      default:
        return null;
    }
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getFeaturedVideoEmbedUrl = (): string | null => {
    if (!streamData.featured_video_url) return null;
    
    const videoId = extractYouTubeVideoId(streamData.featured_video_url);
    if (!videoId) return null;
    
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const renderPlayerVariant = () => {
    const streamUrl = getStreamUrl();
    const channelUrl = getChannelUrl();
    
    if (!streamData.stream_platform || !streamData.stream_channel) {
      return (
        <div className="text-center py-12 text-gray-400">
          <PlatformIcon platform="twitch" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No stream configured</p>
          <p className="text-sm">Add your Twitch or YouTube channel to show your latest streams</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Stream Title */}
        {streamData.stream_last_title && (
          <div className="text-center">
            <h4 className={`text-lg font-medium ${themeClasses.textPrimary} mb-2`}>
              {streamData.stream_last_title}
            </h4>
            <p className="text-sm text-gray-400">Latest Stream</p>
          </div>
        )}
        
        {/* Stream Player */}
        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-700/50">
          {streamUrl ? (
            <iframe
              src={streamUrl}
              title="Live Stream"
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
              <div className="text-center text-gray-400">
                <PlatformIcon 
                  platform={streamData.stream_platform} 
                  className="w-12 h-12 mx-auto mb-2" 
                />
                <p>Stream player unavailable</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Channel Link */}
        {channelUrl && (
          <div className="text-center">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${themeClasses.accentBg} text-white font-medium ${themeClasses.hoverAccent} transition-all duration-200`}
            >
              <PlatformIcon platform={streamData.stream_platform} className="w-5 h-5" />
              Visit Channel
            </a>
          </div>
        )}
      </div>
    );
  };

  const renderThumbnailVariant = () => {
    const channelUrl = getChannelUrl();
    
    if (!streamData.stream_platform || !streamData.stream_channel) {
      return (
        <div className="text-center py-8 text-gray-400">
          <PlatformIcon platform="twitch" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No stream configured</p>
          <p className="text-sm">Add your streaming channel</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-18 sm:w-40 sm:h-22 rounded-lg overflow-hidden border border-gray-700/50 bg-gray-800/50">
            {streamData.stream_last_thumbnail ? (
              <Image
                src={streamData.stream_last_thumbnail}
                alt="Stream thumbnail"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlatformIcon 
                  platform={streamData.stream_platform} 
                  className="w-8 h-8 text-gray-500" 
                />
              </div>
            )}
            
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
            <PlatformIcon platform={streamData.stream_platform} className="w-5 h-5" />
            <span className={`text-sm font-medium ${themeClasses.textPrimary} capitalize`}>
              {streamData.stream_platform}
            </span>
          </div>
          
          {streamData.stream_last_title && (
            <h4 className={`text-base font-medium ${themeClasses.textPrimary} mb-2 line-clamp-2`}>
              {streamData.stream_last_title}
            </h4>
          )}
          
          <p className="text-sm text-gray-400 mb-3">
            @{streamData.stream_channel}
          </p>
          
          {channelUrl && (
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${themeClasses.accentBg} text-white text-sm font-medium ${themeClasses.hoverAccent} transition-all duration-200`}
            >
              Watch Live
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    );
  };

  const renderFeaturedVariant = () => {
    const embedUrl = getFeaturedVideoEmbedUrl();
    
    if (!streamData.featured_video_url) {
      return (
        <div className="text-center py-12 text-gray-400">
          <PlatformIcon platform="youtube" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No featured video</p>
          <p className="text-sm">Add a YouTube video URL to feature your best content</p>
          <p className="text-xs mt-2 text-gray-500">Note: Featured video requires database migration</p>
        </div>
      );
    }

    if (!embedUrl) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg mb-2">Invalid video URL</p>
          <p className="text-sm">Please check your YouTube video link</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Video Title */}
        {streamData.featured_video_title && (
          <div className="text-center">
            <h4 className={`text-lg font-medium ${themeClasses.textPrimary} mb-2`}>
              {streamData.featured_video_title}
            </h4>
            <p className="text-sm text-gray-400">Featured Video</p>
          </div>
        )}
        
        {/* Video Player */}
        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-700/50">
          <iframe
            src={embedUrl}
            title={streamData.featured_video_title || "Featured Video"}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        
        {/* Video Link */}
        <div className="text-center">
          <a
            href={streamData.featured_video_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${themeClasses.accentBg} text-white font-medium ${themeClasses.hoverAccent} transition-all duration-200`}
          >
            <PlatformIcon platform="youtube" className="w-5 h-5" />
            Watch on YouTube
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
            </svg>
          </a>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>{error}</p>
        </div>
      );
    }

    switch (variant) {
      case 'thumbnail':
        return renderThumbnailVariant();
      case 'featured':
        return renderFeaturedVariant();
      case 'player':
      default:
        return renderPlayerVariant();
    }
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon 
            platform={streamData.stream_platform || 'twitch'} 
            className={`w-6 h-6 ${themeClasses.textPrimary}`} 
          />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {variant === 'player' ? 'Latest Stream' : variant === 'featured' ? 'Featured Video' : 'Live Stream'}
          </h3>
        </div>
        {streamData.stream_platform && (
          <div className={`text-sm ${themeClasses.textSecondary} capitalize`}>
            {streamData.stream_platform}
          </div>
        )}
      </div>

      {/* Content */}
      {renderContent()}

    </div>
  );
}

// Export variants for the block picker
export const streamBlockVariants = [
  {
    id: 'player',
    name: 'Large Player',
    description: 'Full-size embedded stream player with title and channel link'
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail',
    description: 'Compact view with thumbnail and watch button'
  },
  {
    id: 'featured',
    name: 'Featured Video',
    description: 'Show a specific featured YouTube video'
  }
];