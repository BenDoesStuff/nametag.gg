"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { PlatformIcon } from '@/components/PlatformIcon';
import { supabase } from '@/lib/supabaseClient';

interface TeamMember {
  id: string;
  member_name: string;
  role?: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
  joined_at: string;
  display_order: number;
}

interface RosterBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
  onEdit?: (block: ProfileBlock) => void;
  onDelete?: (blockId: string) => void;
  className?: string;
}

export function RosterBlock({ 
  block, 
  profile, 
  isEditing = false, 
  onEdit, 
  onDelete, 
  className = '' 
}: RosterBlockProps) {
  const { themeClasses } = useTheme();
  const variant = block.variant || 'grid';
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch team roster data
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: teamData, error: teamError } = await supabase
          .from('profile_team')
          .select('*')
          .eq('profile_id', profile.id)
          .order('display_order', { ascending: true })
          .order('joined_at', { ascending: true });

        if (teamError) {
          console.error('Error fetching team data:', teamError);
          setError('Failed to load team roster');
          setTeamMembers([]);
        } else {
          setTeamMembers(teamData || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching team data:', err);
        setError('Failed to load team roster');
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [profile?.id]);

  const renderGridVariant = () => {
    if (teamMembers.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <PlatformIcon platform="users" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No team members yet</p>
          <p className="text-sm">Add your team roster to showcase your squad</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className={`text-center group ${themeClasses.hoverAccent} transition-all duration-200`}
          >
            {/* Avatar */}
            <div className="relative mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-600 group-hover:border-blue-500 transition-colors">
                {member.avatar_url ? (
                  <Image
                    src={member.avatar_url}
                    alt={member.member_name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className={`text-lg font-bold ${themeClasses.textPrimary}`}>
                    {member.member_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              
              {/* Role badge */}
              {member.role && (
                <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium ${themeClasses.accentBg} text-white`}>
                  {member.role}
                </div>
              )}
            </div>
            
            {/* Name */}
            <h4 className={`text-sm font-medium ${themeClasses.textPrimary} mb-1 truncate`}>
              {member.member_name}
            </h4>
            
            {/* Join date */}
            <p className="text-xs text-gray-400">
              Since {new Date(member.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            
            {/* Social links */}
            {member.social_links && Object.keys(member.social_links).length > 0 && (
              <div className="flex justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {Object.entries(member.social_links).slice(0, 3).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <PlatformIcon platform={platform as any} className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderListVariant = () => {
    if (teamMembers.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <PlatformIcon platform="users" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">No team members yet</p>
          <p className="text-sm">Build your roster and show off your team</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className={`${themeClasses.cardBg} rounded-lg p-4 border border-gray-700/50 ${themeClasses.hoverAccent} transition-all duration-200`}
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                  {member.avatar_url ? (
                    <Image
                      src={member.avatar_url}
                      alt={member.member_name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className={`text-sm font-bold ${themeClasses.textPrimary}`}>
                      {member.member_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Member info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`text-base font-medium ${themeClasses.textPrimary} truncate`}>
                    {member.member_name}
                  </h4>
                  {member.role && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${themeClasses.accentBg} text-white flex-shrink-0`}>
                      {member.role}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Joined {new Date(member.joined_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              
              {/* Social links */}
              {member.social_links && Object.keys(member.social_links).length > 0 && (
                <div className="flex gap-2 flex-shrink-0">
                  {Object.entries(member.social_links).slice(0, 4).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg ${themeClasses.cardBg} text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 transition-all duration-200`}
                      title={`${member.member_name} on ${platform}`}
                    >
                      <PlatformIcon platform={platform as any} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
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
      case 'list':
        return renderListVariant();
      case 'grid':
      default:
        return renderGridVariant();
    }
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 relative ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PlatformIcon platform="users" className={`w-6 h-6 ${themeClasses.textPrimary}`} />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Team Roster
            {teamMembers.length > 0 && (
              <span className="ml-2 text-sm text-gray-400 font-normal">
                ({teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'})
              </span>
            )}
          </h3>
        </div>
        <div className={`text-sm ${themeClasses.textSecondary} capitalize`}>
          {variant === 'grid' ? 'Grid View' : 'List View'}
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Edit Controls */}
      {isEditing && (
        <>
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
            Roster Block - {variant}
          </div>
          <div className="absolute top-2 right-20 flex gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(block)}
                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded text-xs"
                title="Edit block"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(block.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs"
                title="Delete block"
              >
                🗑️
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Export variants for the block picker
export const rosterBlockVariants = [
  {
    id: 'grid',
    name: 'Avatar Grid',
    description: '5-player avatar grid with roles and hover effects'
  },
  {
    id: 'list',
    name: 'Detailed List',
    description: 'Scrollable list with join dates and social links'
  }
];