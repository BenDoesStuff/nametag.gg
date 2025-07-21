"use client";

import React from 'react';
import Image from 'next/image';
import { ProfileBlock } from '@/types/layout';
import { useTheme } from '@/components/ThemeProvider';
import { useUserGames } from '@/hooks/useUserGames';
import { DEFAULT_GAME_POSTER } from '@/data/games';

interface GamesBlockProps {
  block: ProfileBlock;
  profile: any;
  isEditing?: boolean;
}

export function GamesBlock({ block, profile, isEditing = false }: GamesBlockProps) {
  const { themeClasses } = useTheme();
  const { games, loading } = useUserGames(profile?.id);
  const variant = block.variant || 'coverLarge';

  const renderSmallGrid = () => (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
      {games.slice(0, 12).map((userGame) => {
        const game = userGame.game;
        if (!game) return null;

        return (
          <div
            key={userGame.id}
            className="group relative aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
            title={game.name}
          >
            <Image
              src={game.poster || DEFAULT_GAME_POSTER}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, 12vw"
            />
          </div>
        );
      })}
    </div>
  );

  const renderLargeGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {games.slice(0, 10).map((userGame) => {
        const game = userGame.game;
        if (!game) return null;

        return (
          <div
            key={userGame.id}
            className="group bg-gray-900/60 hover:bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            title={game.name}
          >
            <div className="relative w-full aspect-[3/4] bg-gray-800">
              <Image
                src={game.poster || DEFAULT_GAME_POSTER}
                alt={game.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-200"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              />
              
              {/* Category badge */}
              {game.category && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {game.category}
                </div>
              )}
            </div>

            <div className="p-3">
              <div className="text-white text-xs sm:text-sm font-medium leading-tight truncate">
                {game.name}
              </div>
              {game.platforms && game.platforms.length > 0 && (
                <div className="text-gray-400 text-xs mt-1 truncate">
                  {game.platforms.join(', ')}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCarousel = () => (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {games.map((userGame) => {
        const game = userGame.game;
        if (!game) return null;

        return (
          <div
            key={userGame.id}
            className="flex-shrink-0 w-32 sm:w-40 group"
            title={game.name}
          >
            <div className="relative aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200">
              <Image
                src={game.poster || DEFAULT_GAME_POSTER}
                alt={game.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <div className="mt-2 text-center">
              <div className="text-white text-sm font-medium truncate">{game.name}</div>
              <div className="text-gray-400 text-xs truncate">{game.category}</div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderShowcase = () => (
    <div className="space-y-4">
      {games.slice(0, 3).map((userGame) => {
        const game = userGame.game;
        if (!game) return null;

        return (
          <div
            key={userGame.id}
            className={`${themeClasses.cardBg} rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200`}
          >
            <div className="flex gap-4">
              <div className="relative w-16 h-20 sm:w-20 sm:h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={game.poster || DEFAULT_GAME_POSTER}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium mb-1">{game.name}</h4>
                <div className="text-gray-400 text-sm mb-2">{game.category}</div>
                {game.platforms && (
                  <div className="text-gray-500 text-xs">
                    {game.platforms.join(' • ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-800 rounded-lg aspect-[3/4]"></div>
          ))}
        </div>
      );
    }

    if (games.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.58 16.09l-1.09-7.64A3 3 0 0017.56 6H16V5a3 3 0 00-6 0v1H6.44a3 3 0 00-2.93 2.45L2.42 16.09A2 2 0 004.42 18H8v1a3 3 0 006 0v-1h3.58a2 2 0 002-1.91zM12 3a1 1 0 011 1v1h-2V4a1 1 0 011-1zM6.44 8H10v2a1 1 0 002 0V8h3.56a1 1 0 01.98.82l.54 3.81-.52.37-2-.37-.54.2v2.17a1 1 0 01-2 0v-2.17l-.54-.2-2 .37-.52-.37.54-3.81A1 1 0 016.44 8z"/>
          </svg>
          <p className="text-lg mb-2">No games selected</p>
          <p className="text-sm">This user hasn't added any games to their profile yet</p>
        </div>
      );
    }

    switch (variant) {
      case 'coverSmall':
        return renderSmallGrid();
      case 'carousel':
        return renderCarousel();
      case 'showcase':
        return renderShowcase();
      case 'coverLarge':
      default:
        return renderLargeGrid();
    }
  };

  return (
    <div className={`${themeClasses.cardBg} backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-700/50 relative`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-white">
          Games I Play
          <span className="ml-2 text-sm text-gray-400 font-normal">
            ({games.length})
          </span>
        </h3>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Edit indicator */}
      {isEditing && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          Games Block - {variant}
        </div>
      )}
    </div>
  );
}