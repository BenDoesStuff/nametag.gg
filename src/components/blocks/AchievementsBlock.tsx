"use client";

import React from 'react';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { PlatformIcon } from '@/components/PlatformIcon';

interface AchievementsBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress?: number;
}

export function AchievementsBlock({ block, profile, isEditing = false }: AchievementsBlockProps) {
  const { themeClasses } = useTheme();
  const variant = block.variant || 'grid';

  // Mock achievements data
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: 'First Victory',
      description: 'Win your first match',
      icon: '🏆',
      rarity: 'common',
      unlockedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Streak Master',
      description: 'Win 10 matches in a row',
      icon: '🔥',
      rarity: 'rare',
      unlockedAt: '2024-02-20'
    },
    {
      id: '3',
      name: 'Legend',
      description: 'Reach the highest rank',
      icon: '👑',
      rarity: 'legendary',
      unlockedAt: '2024-03-10'
    },
    {
      id: '4',
      name: 'Team Player',
      description: 'Play 100 team matches',
      icon: '🤝',
      rarity: 'epic',
      unlockedAt: '2024-02-28'
    },
    {
      id: '5',
      name: 'Perfectionist',
      description: 'Complete a perfect game',
      icon: '💎',
      rarity: 'epic',
      unlockedAt: '2024-03-05'
    },
    {
      id: '6',
      name: 'Speed Demon',
      description: 'Finish a match in under 5 minutes',
      icon: '⚡',
      rarity: 'rare'
    }
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-600';
      case 'rare': return 'text-blue-400 border-blue-600';
      case 'epic': return 'text-purple-400 border-purple-600';
      case 'legendary': return 'text-yellow-400 border-yellow-600';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  const renderGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {mockAchievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`${themeClasses.cardBg} rounded-lg p-3 sm:p-4 border-2 ${getRarityColor(achievement.rarity)} transition-all duration-200 hover:scale-105 ${achievement.unlockedAt ? 'opacity-100' : 'opacity-50'}`}
          title={achievement.description}
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl mb-2">{achievement.icon}</div>
            <h4 className="text-white text-sm font-medium mb-1 leading-tight">{achievement.name}</h4>
            <p className="text-gray-400 text-xs leading-tight">{achievement.description}</p>
            {achievement.unlockedAt && (
              <div className="text-xs text-gray-500 mt-2">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderFeatured = () => {
    const featured = mockAchievements.filter(a => a.unlockedAt).slice(0, 3);
    
    return (
      <div className="space-y-4">
        {featured.map((achievement) => (
          <div
            key={achievement.id}
            className={`${themeClasses.cardBg} rounded-lg p-4 border-l-4 ${getRarityColor(achievement.rarity).split(' ')[1]}`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{achievement.name}</h4>
                <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${getRarityColor(achievement.rarity).split(' ')[0]} capitalize`}>
                    {achievement.rarity}
                  </span>
                  {achievement.unlockedAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStats = () => {
    const unlockedCount = mockAchievements.filter(a => a.unlockedAt).length;
    const totalCount = mockAchievements.length;
    const completionRate = Math.round((unlockedCount / totalCount) * 100);

    return (
      <div className="space-y-6">
        {/* Progress Overview */}
        <div className={`${themeClasses.cardBg} rounded-lg p-4 border border-gray-700/50`}>
          <h4 className="text-white font-medium mb-3">Achievement Progress</h4>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Completion</span>
                <span className={themeClasses.textPrimary}>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`${themeClasses.bgPrimary} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {unlockedCount} of {totalCount} achievements unlocked
          </div>
        </div>

        {/* Rarity Breakdown */}
        <div className={`${themeClasses.cardBg} rounded-lg p-4 border border-gray-700/50`}>
          <h4 className="text-white font-medium mb-3">By Rarity</h4>
          <div className="space-y-2">
            {['legendary', 'epic', 'rare', 'common'].map((rarity) => {
              const achievements = mockAchievements.filter(a => a.rarity === rarity);
              const unlocked = achievements.filter(a => a.unlockedAt).length;
              return (
                <div key={rarity} className="flex justify-between items-center">
                  <span className={`text-sm capitalize ${getRarityColor(rarity as Achievement['rarity']).split(' ')[0]}`}>
                    {rarity}
                  </span>
                  <span className="text-sm text-gray-400">
                    {unlocked}/{achievements.length}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (variant) {
      case 'featured':
        return renderFeatured();
      case 'stats':
        return renderStats();
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
          <PlatformIcon platform="trophy" className={`w-6 h-6 ${themeClasses.textPrimary}`} />
          <h3 className="text-lg sm:text-xl font-bold text-white">Achievements</h3>
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Edit indicator */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          Achievements Block - {variant}
        </div>
      )}
    </div>
  );
}