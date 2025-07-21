"use client";

import React, { useState } from 'react';
import { useMyGames } from '@/hooks/useUserGames';
import { Game } from '@/data/games';
import GameSelect from './GameSelect';
import GamePill from './GamePill';

interface GamesSectionProps {
  disabled?: boolean;
}

export const GamesSection: React.FC<GamesSectionProps> = ({
  disabled = false
}) => {
  const {
    games,
    loading,
    error,
    addGame,
    removeGame,
    canAddMore,
    maxGames
  } = useMyGames();

  const [isAdding, setIsAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddGame = async (game: Game) => {
    if (disabled || isAdding) return;

    setIsAdding(true);
    const success = await addGame(game.slug);
    setIsAdding(false);

    if (success) {
      setShowAddForm(false);
    }
  };

  const handleRemoveGame = async (gameSlug: string) => {
    if (disabled) return;
    await removeGame(gameSlug);
  };

  const excludedGameSlugs = games.map(g => g.gameSlug);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Games I Play</h3>
          <p className="text-gray-400 text-sm mt-1">
            Showcase up to {maxGames} games on your profile ({games.length}/{maxGames})
          </p>
        </div>

        {/* Add Game Button */}
        {canAddMore && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={disabled || loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors border border-gray-600 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${showAddForm ? 'rotate-45' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">
              {showAddForm ? 'Cancel' : 'Add Game'}
            </span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Add Game Form */}
      {showAddForm && canAddMore && (
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h4 className="text-white font-medium mb-3">Add a Game</h4>
          <GameSelect
            onSelectGame={handleAddGame}
            excludedGames={excludedGameSlugs}
            disabled={disabled || isAdding}
            placeholder={isAdding ? "Adding game..." : "Search for a game to add..."}
          />
          {isAdding && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Adding game...
            </div>
          )}
        </div>
      )}

      {/* Current Games */}
      <div>
        {loading ? (
          // Loading skeleton
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-700 h-8 w-24 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : games.length > 0 ? (
          <div>
            <h4 className="text-white font-medium mb-3">
              Your Games ({games.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {games.map((userGame) => (
                <GamePill
                  key={userGame.id}
                  game={userGame.game!}
                  onRemove={() => handleRemoveGame(userGame.gameSlug)}
                  showRemove={!disabled}
                />
              ))}
            </div>
          </div>
        ) : (
          // Empty state
          <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
            <svg 
              className="w-12 h-12 mx-auto mb-4 text-gray-500" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M21.58 16.09l-1.09-7.64A3 3 0 0017.56 6H16V5a3 3 0 00-6 0v1H6.44a3 3 0 00-2.93 2.45L2.42 16.09A2 2 0 004.42 18H8v1a3 3 0 006 0v-1h3.58a2 2 0 002-1.91zM12 3a1 1 0 011 1v1h-2V4a1 1 0 011-1zM6.44 8H10v2a1 1 0 002 0V8h3.56a1 1 0 01.98.82l.54 3.81-.52.37-2-.37-.54.2v2.17a1 1 0 01-2 0v-2.17l-.54-.2-2 .37-.52-.37.54-3.81A1 1 0 016.44 8z"/>
            </svg>
            <p className="text-gray-400 mb-4">No games added yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              disabled={disabled}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Your First Game
            </button>
          </div>
        )}
      </div>

      {/* Max Games Warning */}
      {!canAddMore && (
        <div className="p-3 bg-amber-900/50 border border-amber-700 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-amber-300 text-sm font-medium">Maximum games reached</p>
              <p className="text-amber-200 text-xs">
                You've added the maximum of {maxGames} games. Remove a game to add a new one.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
        <h5 className="text-white text-sm font-medium mb-2">💡 Tips</h5>
        <ul className="text-gray-400 text-xs space-y-1">
          <li>• Choose games you're currently playing or favorites</li>
          <li>• Games are displayed in the order you add them</li>
          <li>• Your games will be visible on your public profile</li>
          <li>• You can add up to {maxGames} games total</li>
        </ul>
      </div>
    </div>
  );
};

export default GamesSection;