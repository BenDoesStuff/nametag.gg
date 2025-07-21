"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  ColorTheme, 
  DEFAULT_THEME, 
  PREDEFINED_THEMES, 
  createCustomTheme,
  generateThemeCSS,
  getThemeClasses
} from '@/lib/colorThemes';

export interface UseColorThemeReturn {
  theme: ColorTheme;
  themeClasses: ReturnType<typeof getThemeClasses>;
  loading: boolean;
  error: string | null;
  updateTheme: (theme: ColorTheme) => Promise<boolean>;
  setThemeByName: (themeName: string) => Promise<boolean>;
  setCustomTheme: (hex: string, displayName?: string) => Promise<boolean>;
  resetToDefault: () => Promise<boolean>;
  applyThemeToDOM: () => void;
}

export function useColorTheme(userId?: string): UseColorThemeReturn {
  const [theme, setTheme] = useState<ColorTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get theme classes based on current theme
  const themeClasses = getThemeClasses(theme);

  // Fetch user's color theme from database
  const fetchTheme = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // If no userId provided, try to get current user
      let targetUserId = userId;
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setTheme(DEFAULT_THEME);
          setLoading(false);
          return;
        }
        targetUserId = user.id;
      }

      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('color_theme')
        .eq('id', targetUserId)
        .single();

      if (fetchError) {
        console.error('Detailed fetch error:', {
          message: fetchError.message,
          code: fetchError.code,
          details: fetchError.details,
          hint: fetchError.hint
        });
        
        // If column doesn't exist or other error, use default
        console.warn('Error fetching color theme:', fetchError.message);
        setTheme(DEFAULT_THEME);
        return;
      }

      // Parse and validate theme data
      const colorThemeData = profile?.color_theme;
      if (colorThemeData && 
          colorThemeData.primary && 
          colorThemeData.primaryRgb && 
          colorThemeData.themeName) {
        
        setTheme({
          primary: colorThemeData.primary,
          primaryRgb: colorThemeData.primaryRgb,
          themeName: colorThemeData.themeName,
          displayName: colorThemeData.displayName || colorThemeData.themeName,
          description: colorThemeData.description || 'Custom theme'
        });
      } else {
        setTheme(DEFAULT_THEME);
      }
    } catch (err) {
      console.error('Error fetching color theme:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch color theme');
      setTheme(DEFAULT_THEME);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update user's color theme in database
  const updateTheme = async (newTheme: ColorTheme): Promise<boolean> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          color_theme: {
            primary: newTheme.primary,
            primaryRgb: newTheme.primaryRgb,
            themeName: newTheme.themeName,
            displayName: newTheme.displayName,
            description: newTheme.description
          }
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Detailed update error:', {
          message: updateError.message,
          code: updateError.code,
          details: updateError.details,
          hint: updateError.hint
        });
        
        // If column doesn't exist, provide helpful error
        if (updateError.message.includes('color_theme') || 
            updateError.message.includes('column') || 
            updateError.message.includes('schema cache') ||
            updateError.code === 'PGRST116' || // Column not found
            updateError.code === '42703') {    // PostgreSQL undefined column
          throw new Error(`The color_theme column does not exist. Please add it manually in Supabase SQL Editor.

Exact error: ${updateError.message}
Error code: ${updateError.code || 'N/A'}`);
        }
        throw new Error(`Database error: ${updateError.message} (Code: ${updateError.code || 'N/A'})`);
      }

      setTheme(newTheme);
      return true;
    } catch (err) {
      console.error('Error updating color theme:', err);
      setError(err instanceof Error ? err.message : 'Failed to update color theme');
      return false;
    }
  };

  // Set theme by predefined theme name
  const setThemeByName = async (themeName: string): Promise<boolean> => {
    const predefinedTheme = PREDEFINED_THEMES[themeName];
    if (!predefinedTheme) {
      setError(`Theme "${themeName}" not found`);
      return false;
    }
    return updateTheme(predefinedTheme);
  };

  // Set custom theme from hex color
  const setCustomTheme = async (hex: string, displayName?: string): Promise<boolean> => {
    try {
      const customTheme = createCustomTheme(hex, displayName);
      return updateTheme(customTheme);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid custom theme');
      return false;
    }
  };

  // Reset to default theme
  const resetToDefault = async (): Promise<boolean> => {
    return updateTheme(DEFAULT_THEME);
  };

  // Apply theme to DOM (for dynamic styling)
  const applyThemeToDOM = useCallback(() => {
    const root = document.documentElement;
    const cssVars = generateThemeCSS(theme);
    
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme]);

  // Apply theme to DOM when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      applyThemeToDOM();
    }
  }, [applyThemeToDOM]);

  // Fetch theme on mount
  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  return {
    theme,
    themeClasses,
    loading,
    error,
    updateTheme,
    setThemeByName,
    setCustomTheme,
    resetToDefault,
    applyThemeToDOM,
  };
}

// Helper hook for viewing other users' themes (read-only)
export function useUserColorTheme(userId: string): Omit<UseColorThemeReturn, 'updateTheme' | 'setThemeByName' | 'setCustomTheme' | 'resetToDefault'> {
  const { 
    theme, 
    themeClasses, 
    loading, 
    error, 
    applyThemeToDOM 
  } = useColorTheme(userId);

  return {
    theme,
    themeClasses,
    loading,
    error,
    applyThemeToDOM,
  };
}