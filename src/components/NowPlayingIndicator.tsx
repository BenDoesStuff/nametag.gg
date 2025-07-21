/**
 * Now Playing Indicator Component
 * Shows currently playing Spotify track with headphone icon
 */

'use client';

import React from 'react';
import { Headphones, ExternalLink } from 'lucide-react';
import { useSimpleNowPlaying } from '@/hooks/useNowPlaying';

interface NowPlayingIndicatorProps {
  /** User ID to check now playing for */
  userId?: string;
  /** Whether to show the track details in tooltip */
  showTooltip?: boolean;
  /** Whether to show external link */
  showLink?: boolean;
  /** Custom icon size */
  iconSize?: 'sm' | 'md' | 'lg';
  /** Custom CSS classes */
  className?: string;
}

export function NowPlayingIndicator({
  userId,
  showTooltip = true,
  showLink = false,
  iconSize = 'md',
  className = '',
}: NowPlayingIndicatorProps) {
  const { isPlaying, track } = useSimpleNowPlaying(userId);

  // Don't render anything if not playing
  if (!isPlaying || !track) {
    return null;
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconClass = iconSizes[iconSize];

  const content = (
    <div className={`inline-flex items-center gap-1 text-neon-green animate-pulse ${className}`}>
      <Headphones className={iconClass} />
      {showLink && track.externalUrl && (
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neon-green/80 transition-colors"
        >
          <ExternalLink className={iconClass} />
        </a>
      )}
    </div>
  );

  // With tooltip
  if (showTooltip) {
    return (
      <div className="relative group">
        {content}
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          <div className="font-medium">{track.title}</div>
          <div className="text-gray-300 text-xs">{track.artist}</div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return content;
}

/**
 * Compact version for use in headers or small spaces
 */
export function CompactNowPlayingIndicator(props: Omit<NowPlayingIndicatorProps, 'iconSize'>) {
  return <NowPlayingIndicator {...props} iconSize="sm" />;
}

/**
 * Detailed version that shows track info inline
 */
export function DetailedNowPlayingIndicator({
  userId,
  showLink = true,
  className = '',
}: Omit<NowPlayingIndicatorProps, 'showTooltip' | 'iconSize'>) {
  const { isPlaying, track } = useSimpleNowPlaying(userId);

  if (!isPlaying || !track) {
    return null;
  }

  return (
    <div className={`inline-flex items-center gap-2 text-neon-green animate-pulse ${className}`}>
      <Headphones className="w-4 h-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium">
          Now listening: {track.title}
        </span>
        <span className="text-xs text-gray-400 ml-2">
          by {track.artist}
        </span>
      </div>
      
      {showLink && track.externalUrl && (
        <a
          href={track.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-1 hover:text-neon-green/80 transition-colors"
          title="Open in Spotify"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

/**
 * Floating now playing widget for profile pages
 */
export function FloatingNowPlaying({
  userId,
  className = '',
}: Pick<NowPlayingIndicatorProps, 'userId' | 'className'>) {
  const { isPlaying, track } = useSimpleNowPlaying(userId);

  if (!isPlaying || !track) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 border border-neon-green/30 shadow-lg z-40 max-w-xs ${className}`}>
      <div className="flex items-center gap-3">
        <Headphones className="w-5 h-5 text-neon-green animate-pulse flex-shrink-0" />
        
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-medium line-clamp-1">
            {track.title}
          </p>
          <p className="text-gray-400 text-xs line-clamp-1">
            {track.artist}
          </p>
        </div>
        
        {track.externalUrl && (
          <a
            href={track.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-1 text-neon-green hover:text-neon-green/80 transition-colors"
            title="Open in Spotify"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}