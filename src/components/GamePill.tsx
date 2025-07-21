"use client";

import React from 'react';
import Image from 'next/image';
import { Game, DEFAULT_GAME_ICON, DEFAULT_GAME_POSTER } from '@/data/games';

interface GamePillProps {
  game: Game;
  onRemove?: () => void;
  showRemove?: boolean;
  className?: string;
}

export const GamePill: React.FC<GamePillProps> = ({
  game,
  onRemove,
  showRemove = false,
  className = ''
}) => {
  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-2 
      bg-gray-800 hover:bg-gray-700 
      border border-gray-600 hover:border-gray-500
      rounded-lg transition-all duration-200
      text-sm font-medium text-white
      ${className}
    `}>
      {/* Game Thumbnail */}
      <div className="flex-shrink-0">
        <div className="relative w-5 h-5 rounded overflow-hidden bg-gray-700">
          <Image
            src={game.poster || DEFAULT_GAME_POSTER}
            alt={game.name}
            fill
            className="object-cover"
            sizes="20px"
            onError={(e) => {
              // Fallback to default poster if game poster fails to load
              const target = e.target as HTMLImageElement;
              if (target.src !== DEFAULT_GAME_POSTER) {
                target.src = DEFAULT_GAME_POSTER;
              }
            }}
          />
        </div>
      </div>

      {/* Game Name */}
      <span className="truncate max-w-[120px] sm:max-w-[150px]">
        {game.name}
      </span>

      {/* Remove Button */}
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="flex-shrink-0 p-1 hover:bg-red-600/20 rounded transition-colors"
          title={`Remove ${game.name}`}
          type="button"
        >
          <svg 
            className="w-3 h-3 text-gray-400 hover:text-red-400 transition-colors" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default GamePill;