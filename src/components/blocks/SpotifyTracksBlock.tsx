/**
 * Spotify Tracks Block Component
 * Displays user's favorite Spotify tracks in grid or list format
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Music, ExternalLink, RefreshCw, Play, Clock } from 'lucide-react';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { useSpotifyTracks, SpotifyTrack } from '@/hooks/useSpotifyTracks';
import { ConnectSpotifyButton } from '@/components/ConnectSpotifyButton';
import { formatDuration } from '@/lib/spotify';
import { supabase } from '@/lib/supabaseClient';

interface SpotifyTracksBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
  onEdit?: (block: ProfileBlock) => void;
  onDelete?: (blockId: string) => void;
  className?: string;
}

export function SpotifyTracksBlock({ 
  block, 
  profile, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: SpotifyTracksBlockProps) {
  const { themeClasses } = useTheme();
  const variant = block.variant || 'grid';
  const [syncing, setSyncing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { 
    tracks, 
    loading, 
    error, 
    isConnected, 
    syncTracks 
  } = useSpotifyTracks(profile?.id, {
    timeRange: 'short_term',
    limit: 10,
  });

  // Debug logging
  console.log('SpotifyTracksBlock debug:', {
    profileId: profile?.id,
    isConnected,
    tracksCount: tracks.length,
    loading,
    error,
    sampleTrack: tracks[0]
  });

  // Check if current user is authenticated and owns this profile
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncTracks();
    } catch (err) {
      console.error('Failed to sync tracks:', err);
    } finally {
      setSyncing(false);
    }
  };

  const renderGridVariant = () => {
    if (!isConnected) {
      return (
        <div className="text-center py-8">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 mb-4">Connect Spotify to show favorite tracks</p>
          {currentUser && profile && currentUser.id === profile.id && (
            <ConnectSpotifyButton
              variant="secondary"
              text="Connect Spotify"
            />
          )}
        </div>
      );
    }

    if (loading && tracks.length === 0) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-700 rounded-md animate-pulse" />
          ))}
        </div>
      );
    }

    if (tracks.length === 0) {
      return (
        <div className="text-center py-8">
          <Music className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400 mb-4">No tracks found</p>
          {isEditing && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`px-4 py-2 rounded-lg ${themeClasses.bgPrimary} text-white text-sm`}
            >
              {syncing ? 'Syncing...' : 'Sync Tracks'}
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tracks.slice(0, 10).map((track, index) => (
          <TrackGridItem key={track.id} track={track} index={index} />
        ))}
      </div>
    );
  };

  const renderListVariant = () => {
    if (!isConnected) {
      return (
        <div className="text-center py-8">
          <Music className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400 mb-4">Connect Spotify to show favorite tracks</p>
          {currentUser && profile && currentUser.id === profile.id && (
            <ConnectSpotifyButton
              variant="secondary"
              text="Connect Spotify"
            />
          )}
        </div>
      );
    }

    if (loading && tracks.length === 0) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 rounded animate-pulse" />
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="w-1/2 h-3 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (tracks.length === 0) {
      return (
        <div className="text-center py-8">
          <Music className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400 mb-4">No tracks found</p>
          {isEditing && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`px-4 py-2 rounded-lg ${themeClasses.bgPrimary} text-white text-sm`}
            >
              {syncing ? 'Syncing...' : 'Sync Tracks'}
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {tracks.slice(0, 10).map((track, index) => (
          <TrackListItem key={track.id} track={track} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Music className={`w-6 h-6 ${themeClasses.textPrimary}`} />
          <h3 className="text-lg font-bold text-white">
            Favorite Songs
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected && (
            <span className="text-xs text-gray-400">
              Last 4 weeks
            </span>
          )}
          
          {isEditing && isConnected && (
            <button
              onClick={handleSync}
              disabled={syncing || loading}
              className={`p-1 rounded ${themeClasses.bgPrimary} text-white disabled:opacity-50`}
              title="Sync latest tracks"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Content */}
      {variant === 'list' ? renderListVariant() : renderGridVariant()}
    </div>
  );
}

// Individual track components
function TrackGridItem({ track, index }: { track: SpotifyTrack; index: number }) {
  const { themeClasses } = useTheme();
  
  return (
    <div className="group relative aspect-square rounded-md overflow-hidden bg-gray-800">
      {track.album_art_url && (
        <img
          src={`/api/proxy-image?url=${encodeURIComponent(track.album_art_url)}`}
          alt={`${track.title} by ${track.artist}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
        {/* Track number */}
        <div className="self-start">
          <span className={`text-xs font-bold px-2 py-1 rounded ${themeClasses.bgPrimary} text-white`}>
            #{index + 1}
          </span>
        </div>
        
        {/* Track info */}
        <div className="text-center">
          <p className="text-white text-sm font-medium line-clamp-2 mb-1">
            {track.title}
          </p>
          <p className="text-gray-300 text-xs line-clamp-1">
            {track.artist}
          </p>
        </div>
        
        {/* Play button */}
        <div className="self-center">
          {track.external_url && (
            <a
              href={track.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center w-8 h-8 rounded-full ${themeClasses.bgPrimary} text-white hover:scale-110 transition-transform`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function TrackListItem({ track, index }: { track: SpotifyTrack; index: number }) {
  const { themeClasses } = useTheme();
  
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/30 transition-colors group">
      {/* Track Number */}
      <span className={`text-sm font-bold w-6 text-center ${themeClasses.textSecondary}`}>
        {index + 1}
      </span>
      
      {/* Album Art */}
      <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-800 flex-shrink-0">
        {track.album_art_url ? (
          <img
            src={`/api/proxy-image?url=${encodeURIComponent(track.album_art_url)}`}
            alt={`${track.title} by ${track.artist}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-6 h-6 text-gray-500" />
          </div>
        )}
      </div>
      
      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${themeClasses.textPrimary} line-clamp-1`}>
          {track.title}
        </p>
        <p className={`text-sm ${themeClasses.textSecondary} line-clamp-1`}>
          {track.artist}
        </p>
      </div>
      
      {/* Duration */}
      {track.duration_ms && (
        <span className={`text-sm ${themeClasses.textSecondary} flex items-center gap-1`}>
          <Clock className="w-3 h-3" />
          {formatDuration(track.duration_ms)}
        </span>
      )}
      
      {/* External Link */}
      {track.external_url && (
        <a
          href={track.external_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`opacity-0 group-hover:opacity-100 p-2 rounded ${themeClasses.bgPrimary} text-white transition-opacity`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

// Export variants for the block picker
export const spotifyTracksBlockVariants = [
  {
    id: 'grid',
    name: 'Album Grid',
    description: '5×2 grid of album artwork with hover details'
  },
  {
    id: 'list',
    name: 'Track List',
    description: 'Vertical list with track details and play buttons'
  }
];