"use client";

import React from 'react';
import Image from 'next/image';
import { UserGame } from '@/hooks/useUserGames';
import { DEFAULT_GAME_ICON, DEFAULT_GAME_POSTER } from '@/data/games';

interface GameGridProps {
  games: UserGame[];
  loading?: boolean;
  className?: string;
  showEmptyState?: boolean;
}

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  loading = false,
  className = '',
  showEmptyState = true
}) => {
  // Loading state
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-white">Games I Play</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="animate-pulse bg-gray-800 rounded-lg p-3 border border-gray-700"
            >
              <div className="w-8 h-8 bg-gray-600 rounded mb-2 mx-auto"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (games.length === 0 && showEmptyState) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-white">Games I Play</h3>
        <div className="text-center py-8 text-gray-400">
          <svg 
            className="w-16 h-16 mx-auto mb-4 opacity-50" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M21.58 16.09l-1.09-7.64A3 3 0 0017.56 6H16V5a3 3 0 00-6 0v1H6.44a3 3 0 00-2.93 2.45L2.42 16.09A2 2 0 004.42 18H8v1a3 3 0 006 0v-1h3.58a2 2 0 002-1.91zM12 3a1 1 0 011 1v1h-2V4a1 1 0 011-1zM6.44 8H10v2a1 1 0 002 0V8h3.56a1 1 0 01.98.82l.54 3.81-.52.37-2-.37-.54.2v2.17a1 1 0 01-2 0v-2.17l-.54-.2-2 .37-.52-.37.54-3.81A1 1 0 016.44 8z"/>
          </svg>
          <p className="text-lg mb-2">No games selected</p>
          <p className="text-sm">This user hasn't added any games to their profile yet</p>
        </div>
      </div>
    );
  }

  // Don't show section if no games and showEmptyState is false
  if (games.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Games I Play
          <span className="ml-2 text-sm text-gray-400 font-normal">
            ({games.length})
          </span>
        </h3>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {games.map((userGame) => {
          const game = userGame.game;
          if (!game) return null;

          return (
            <div
              key={userGame.id}
              className="group bg-gray-900/60 hover:bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              title={game.name}
            >
              {/* Game Poster */}
              <div className="relative w-full aspect-[3/4] bg-gray-800">
                <Image
                  src={game.poster || DEFAULT_GAME_POSTER}
                  alt={game.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-200"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== DEFAULT_GAME_POSTER) {
                      console.log(`Failed to load poster for ${game.name}: ${target.src}`);
                      target.src = DEFAULT_GAME_POSTER;
                    }
                  }}
                />
                
                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {/* Category badge */}
                {game.category && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {game.category}
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="p-3">
                <div className="text-white text-xs sm:text-sm font-medium leading-tight truncate group-hover:text-current transition-colors">
                  {game.name}
                </div>
                
                {/* Platforms */}
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

      {/* Show more indicator if close to max */}
      {games.length >= 8 && games.length < 10 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 border border-gray-600 rounded-full text-xs text-gray-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Can add {10 - games.length} more game{10 - games.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameGrid;