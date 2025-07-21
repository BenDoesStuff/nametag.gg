"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { GAME_CATALOG, Game, searchGames, DEFAULT_GAME_ICON, DEFAULT_GAME_POSTER } from '@/data/games';

interface GameSelectProps {
  onSelectGame: (game: Game) => void;
  excludedGames?: string[]; // Array of game slugs to exclude
  disabled?: boolean;
  placeholder?: string;
}

export const GameSelect: React.FC<GameSelectProps> = ({
  onSelectGame,
  excludedGames = [],
  disabled = false,
  placeholder = "Search for a game..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Filter games based on search query and excluded games
  const filteredGames = useMemo(() => {
    let games = query.trim() ? searchGames(query) : GAME_CATALOG;
    
    // Exclude already selected games
    games = games.filter(game => !excludedGames.includes(game.slug));
    
    // Sort by relevance (exact matches first, then alphabetical)
    games.sort((a, b) => {
      const queryLower = query.toLowerCase();
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact matches first
      if (aName === queryLower && bName !== queryLower) return -1;
      if (bName === queryLower && aName !== queryLower) return 1;
      
      // Starts with query
      if (aName.startsWith(queryLower) && !bName.startsWith(queryLower)) return -1;
      if (bName.startsWith(queryLower) && !aName.startsWith(queryLower)) return 1;
      
      // Alphabetical
      return aName.localeCompare(bName);
    });
    
    return games.slice(0, 50); // Limit results for performance
  }, [query, excludedGames]);

  const handleSelectGame = (game: Game) => {
    onSelectGame(game);
    setQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  };

  const handleInputFocus = () => {
    if (query.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow click on dropdown items
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2 pl-10 pr-4
            bg-gray-900 text-white border border-gray-600 rounded-lg
            focus:border-current focus:outline-none
            placeholder-gray-400
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'}
          `}
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg 
            className="w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-gray-900 border border-gray-600 rounded-lg shadow-lg">
          {filteredGames.length > 0 ? (
            <div className="py-1">
              {filteredGames.map((game) => (
                <button
                  key={game.slug}
                  onClick={() => handleSelectGame(game)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-800 transition-colors flex items-center gap-3"
                  type="button"
                >
                  {/* Game Thumbnail */}
                  <div className="flex-shrink-0">
                    <div className="relative w-6 h-6 rounded overflow-hidden bg-gray-700">
                      <Image
                        src={game.poster || DEFAULT_GAME_POSTER}
                        alt={game.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== DEFAULT_GAME_POSTER) {
                            target.src = DEFAULT_GAME_POSTER;
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {game.name}
                    </div>
                    {game.category && (
                      <div className="text-gray-400 text-xs truncate">
                        {game.category}
                        {game.platforms && game.platforms.length > 0 && (
                          <span> • {game.platforms.join(', ')}</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-gray-400">
              <svg 
                className="w-8 h-8 mx-auto mb-2 opacity-50" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709M5 18H3a2 2 0 01-2-2V4a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L4.3 9.228a11.25 11.25 0 008.471 8.471l.841-1.924a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V20a2 2 0 01-2 2h-2M9 4v1m6-1v1" 
                />
              </svg>
              <div className="text-sm">
                No games found for "{query}"
              </div>
              <div className="text-xs mt-1">
                Try a different search term
              </div>
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {!isOpen && (
        <div className="mt-1 text-xs text-gray-400">
          Start typing to search from {GAME_CATALOG.length}+ games
        </div>
      )}
    </div>
  );
};

export default GameSelect;