"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Game, getGameBySlug, DEFAULT_GAME_ICON } from '@/data/games';

export interface UserGame {
  id: string;
  gameSlug: string;
  game: Game | null;
  createdAt: string;
}

export interface UseUserGamesReturn {
  games: UserGame[];
  loading: boolean;
  error: string | null;
  addGame: (gameSlug: string) => Promise<boolean>;
  removeGame: (gameSlug: string) => Promise<boolean>;
  canAddMore: boolean;
  maxGames: number;
  refetch: () => void;
}

const MAX_GAMES = 10;

export function useUserGames(profileId?: string): UseUserGamesReturn {
  const [games, setGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch games for a profile
  const fetchGames = useCallback(async () => {
    if (!profileId) {
      setGames([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try using the database function first
      const { data: functionData, error: functionError } = await supabase
        .rpc('get_profile_games', { target_profile_id: profileId });

      let gamesData;
      if (functionError) {
        // Fallback to direct query
        console.warn('Database function failed, using direct query:', functionError.message);
        const { data: directData, error: directError } = await supabase
          .from('profile_games')
          .select('id, game_slug, created_at')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: true });

        if (directError) {
          throw new Error(directError.message);
        }
        gamesData = directData;
      } else {
        gamesData = functionData;
      }

      // Map database data to UserGame objects with game details
      const userGames: UserGame[] = (gamesData || []).map((item: any) => ({
        id: item.id,
        gameSlug: item.game_slug,
        game: getGameBySlug(item.game_slug) || {
          slug: item.game_slug,
          name: item.game_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          icon: DEFAULT_GAME_ICON
        },
        createdAt: item.created_at
      }));

      setGames(userGames);
    } catch (err) {
      console.error('Error fetching user games:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  // Add a game to user's list
  const addGame = async (gameSlug: string): Promise<boolean> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Check if game already exists
      const existingGame = games.find(g => g.gameSlug === gameSlug);
      if (existingGame) {
        setError('Game already added to your list');
        return false;
      }

      // Check max games limit
      if (games.length >= MAX_GAMES) {
        setError(`Maximum ${MAX_GAMES} games allowed`);
        return false;
      }

      // Insert new game
      const { data, error: insertError } = await supabase
        .from('profile_games')
        .insert({
          profile_id: user.id,
          game_slug: gameSlug
        })
        .select('id, game_slug, created_at')
        .single();

      if (insertError) {
        // Handle specific error messages
        if (insertError.message.includes('Maximum 10 games')) {
          throw new Error(`Maximum ${MAX_GAMES} games allowed per profile`);
        }
        if (insertError.message.includes('duplicate key')) {
          throw new Error('Game already added to your list');
        }
        throw new Error(insertError.message);
      }

      // Add to local state
      const newUserGame: UserGame = {
        id: data.id,
        gameSlug: data.game_slug,
        game: getGameBySlug(data.game_slug) || {
          slug: data.game_slug,
          name: data.game_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          icon: DEFAULT_GAME_ICON
        },
        createdAt: data.created_at
      };

      setGames(prev => [...prev, newUserGame]);
      return true;
    } catch (err) {
      console.error('Error adding game:', err);
      setError(err instanceof Error ? err.message : 'Failed to add game');
      return false;
    }
  };

  // Remove a game from user's list
  const removeGame = async (gameSlug: string): Promise<boolean> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { error: deleteError } = await supabase
        .from('profile_games')
        .delete()
        .eq('profile_id', user.id)
        .eq('game_slug', gameSlug);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Remove from local state
      setGames(prev => prev.filter(g => g.gameSlug !== gameSlug));
      return true;
    } catch (err) {
      console.error('Error removing game:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove game');
      return false;
    }
  };

  // Fetch games on mount and when profileId changes
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return {
    games,
    loading,
    error,
    addGame,
    removeGame,
    canAddMore: games.length < MAX_GAMES,
    maxGames: MAX_GAMES,
    refetch: fetchGames,
  };
}

// Hook specifically for the current authenticated user's games (for editing)
export function useMyGames(): UseUserGamesReturn {
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || '');
    };
    getCurrentUser();
  }, []);

  return useUserGames(currentUserId);
}