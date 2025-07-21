"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface SocialLinks {
  [platform: string]: string;
}

export interface UseSocialLinksReturn {
  socialLinks: SocialLinks;
  loading: boolean;
  error: string | null;
  updateSocialLink: (platform: string, value: string) => Promise<boolean>;
  removeSocialLink: (platform: string) => Promise<boolean>;
  refetch: () => void;
}

export function useSocialLinks(): UseSocialLinksReturn {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('social_links')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        // If column doesn't exist, return empty object
        if (fetchError.message.includes('does not exist')) {
          console.warn('social_links column does not exist yet, returning empty object');
          setSocialLinks({});
          return;
        }
        throw new Error(fetchError.message);
      }

      setSocialLinks(profile?.social_links || {});
    } catch (err) {
      console.error('Error fetching social links:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch social links');
    } finally {
      setLoading(false);
    }
  };

  const updateSocialLink = async (platform: string, value: string): Promise<boolean> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Validate input
      const trimmedPlatform = platform.toLowerCase().trim();
      const trimmedValue = value.trim();

      if (!SUPPORTED_PLATFORMS.includes(trimmedPlatform as any)) {
        throw new Error(`Invalid platform. Supported platforms: ${SUPPORTED_PLATFORMS.join(', ')}`);
      }

      if (trimmedValue.length === 0) {
        throw new Error('Value cannot be empty');
      }

      if (trimmedValue.length > 255) {
        throw new Error('Value must be 255 characters or less');
      }

      // Get current social links
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('social_links')
        .eq('id', user.id)
        .single();

      if (fetchError && !fetchError.message.includes('does not exist')) {
        throw new Error(fetchError.message);
      }

      // Update social links
      const currentLinks = profile?.social_links || {};
      const updatedLinks = {
        ...currentLinks,
        [trimmedPlatform]: trimmedValue
      };

      // Try to update with error handling for missing column
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ social_links: updatedLinks })
        .eq('id', user.id);

      if (updateError) {
        console.error('Update error details:', updateError);
        
        // If column doesn't exist, try to add it automatically
        if (updateError.message.includes('social_links') || 
            updateError.message.includes('column') || 
            updateError.message.includes('schema cache')) {
          
          // Attempt to add the column via RPC call
          try {
            const { error: rpcError } = await supabase.rpc('add_social_links_column');
            if (!rpcError) {
              // Retry the update after adding column
              const { error: retryError } = await supabase
                .from('profiles')
                .update({ social_links: updatedLinks })
                .eq('id', user.id);
              
              if (!retryError) {
                setSocialLinks(updatedLinks);
                return true;
              }
            }
          } catch (rpcErr) {
            // RPC failed, show manual migration instructions
          }
          
          throw new Error('The social_links column does not exist. Please add it manually in Supabase SQL Editor:\n\nALTER TABLE public.profiles ADD COLUMN social_links jsonb DEFAULT \'{}\';');
        }
        throw new Error(updateError.message);
      }

      setSocialLinks(updatedLinks);
      return true;
    } catch (err) {
      console.error('Error updating social link:', err);
      setError(err instanceof Error ? err.message : 'Failed to update social link');
      return false;
    }
  };

  const removeSocialLink = async (platform: string): Promise<boolean> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const trimmedPlatform = platform.toLowerCase().trim();

      // Get current social links
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('social_links')
        .eq('id', user.id)
        .single();

      if (fetchError && !fetchError.message.includes('does not exist')) {
        throw new Error(fetchError.message);
      }

      // Remove the platform from social links
      const currentLinks = profile?.social_links || {};
      const updatedLinks = { ...currentLinks };
      delete updatedLinks[trimmedPlatform];

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ social_links: updatedLinks })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSocialLinks(updatedLinks);
      return true;
    } catch (err) {
      console.error('Error removing social link:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove social link');
      return false;
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  return {
    socialLinks,
    loading,
    error,
    updateSocialLink,
    removeSocialLink,
    refetch: fetchSocialLinks,
  };
}

// Utility functions for platform validation and formatting
export const SUPPORTED_PLATFORMS = [
  'discord',
  'steam', 
  'xbox',
  'playstation',
  'riot',
  'epic',
  'github',
  'twitch',
  'youtube',
  'twitter',
  'instagram',
  'tiktok',
  'spotify'
] as const;

export type SupportedPlatform = typeof SUPPORTED_PLATFORMS[number];

export const PLATFORM_LABELS: Record<SupportedPlatform, string> = {
  discord: 'Discord',
  steam: 'Steam',
  xbox: 'Xbox Live',
  playstation: 'PlayStation',
  riot: 'Riot Games',
  epic: 'Epic Games',
  github: 'GitHub',
  twitch: 'Twitch',
  youtube: 'YouTube',
  twitter: 'Twitter/X',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  spotify: 'Spotify'
};

export const PLATFORM_PLACEHOLDERS: Record<SupportedPlatform, string> = {
  discord: 'username#1234 or discord.gg/invite',
  steam: 'Steam ID or profile URL',
  xbox: 'Xbox Gamertag',
  playstation: 'PSN ID',
  riot: 'username#TAG',
  epic: 'Epic Games username',
  github: 'GitHub username',
  twitch: 'Twitch username',
  youtube: 'Channel URL or @handle',
  twitter: 'Twitter username',
  instagram: 'Instagram username',
  tiktok: 'TikTok username',
  spotify: 'Spotify username or profile URL'
};

// Auto-format function for different platforms
export function formatSocialLink(platform: SupportedPlatform, value: string): string {
  const trimmedValue = value.trim();
  
  switch (platform) {
    case 'steam':
      // Auto-prepend Steam community URL if just username provided
      if (!trimmedValue.startsWith('http') && !trimmedValue.includes('/')) {
        return `https://steamcommunity.com/id/${trimmedValue}`;
      }
      return trimmedValue;
      
    case 'github':
      // Auto-prepend GitHub URL if just username provided
      if (!trimmedValue.startsWith('http') && !trimmedValue.includes('/')) {
        return `https://github.com/${trimmedValue}`;
      }
      return trimmedValue;
      
    case 'twitch':
      // Auto-prepend Twitch URL if just username provided
      if (!trimmedValue.startsWith('http') && !trimmedValue.includes('/')) {
        return `https://twitch.tv/${trimmedValue}`;
      }
      return trimmedValue;
      
    case 'youtube':
      // Auto-prepend YouTube URL if just handle provided
      if (!trimmedValue.startsWith('http') && trimmedValue.startsWith('@')) {
        return `https://youtube.com/${trimmedValue}`;
      }
      if (!trimmedValue.startsWith('http') && !trimmedValue.includes('/')) {
        return `https://youtube.com/c/${trimmedValue}`;
      }
      return trimmedValue;
      
    case 'twitter':
      // Remove @ symbol if present, store just username
      if (trimmedValue.startsWith('@')) {
        return trimmedValue.substring(1);
      }
      return trimmedValue;
      
    case 'instagram':
      // Remove @ symbol if present, store just username
      if (trimmedValue.startsWith('@')) {
        return trimmedValue.substring(1);
      }
      return trimmedValue;
      
    case 'tiktok':
      // Remove @ symbol if present, store just username
      if (trimmedValue.startsWith('@')) {
        return trimmedValue.substring(1);
      }
      return trimmedValue;
      
    case 'spotify':
      // Auto-prepend Spotify URL if just username provided
      if (!trimmedValue.startsWith('http') && !trimmedValue.includes('/')) {
        return `https://open.spotify.com/user/${trimmedValue}`;
      }
      return trimmedValue;
      
    default:
      return trimmedValue;
  }
}

// Generate external URL for visiting the platform
export function getPlatformUrl(platform: SupportedPlatform, value: string): string {
  switch (platform) {
    case 'discord':
      if (value.includes('discord.gg/')) {
        return value.startsWith('http') ? value : `https://${value}`;
      }
      return `https://discord.com/users/${value}`;
      
    case 'steam':
      return value.startsWith('http') ? value : `https://steamcommunity.com/id/${value}`;
      
    case 'github':
      return value.startsWith('http') ? value : `https://github.com/${value}`;
      
    case 'twitch':
      return value.startsWith('http') ? value : `https://twitch.tv/${value}`;
      
    case 'youtube':
      return value.startsWith('http') ? value : `https://youtube.com/${value}`;
      
    case 'twitter':
      return `https://twitter.com/${value.replace('@', '')}`;
      
    case 'instagram':
      return `https://instagram.com/${value.replace('@', '')}`;
      
    case 'tiktok':
      return `https://tiktok.com/@${value.replace('@', '')}`;
      
    case 'spotify':
      return value.startsWith('http') ? value : `https://open.spotify.com/user/${value}`;
      
    case 'xbox':
    case 'playstation':
    case 'riot':
    case 'epic':
    default:
      // For platforms without direct links, return the value as-is
      return value;
  }
}