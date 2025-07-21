"use client";

import React, { createContext, useContext } from 'react';
import { ProfileTheme } from '@/types/layout';
import { DEFAULT_THEME } from '@/lib/themePresets';

interface ThemeContextValue {
  theme: ProfileTheme;
  cssVariables: Record<string, string>;
  themeClasses: {
    textPrimary: string;
    textSecondary: string;
    bgPrimary: string;
    bgSecondary: string;
    borderPrimary: string;
    borderSecondary: string;
    hoverAccent: string;
    cardBg: string;
    style: React.CSSProperties;
  };
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  theme?: ProfileTheme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme = DEFAULT_THEME, children }: ThemeProviderProps) {
  const cssVariables = {
    '--color-bg-from': theme.colors.bgGradient[0],
    '--color-bg-to': theme.colors.bgGradient[1],
    '--color-accent': theme.colors.accent,
    '--color-accent-secondary': theme.colors.accentSecondary,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-card-bg': theme.colors.cardBg,
    '--color-card-border': theme.colors.cardBorder,
  };

  const themeClasses = {
    textPrimary: 'text-[var(--color-accent)]',
    textSecondary: 'text-[var(--color-text-secondary)]',
    bgPrimary: 'bg-[var(--color-accent)]',
    bgSecondary: 'bg-[var(--color-accent-secondary)]',
    borderPrimary: 'border-[var(--color-accent)]',
    borderSecondary: 'border-[var(--color-accent-secondary)]',
    hoverAccent: 'hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]',
    cardBg: 'bg-[var(--color-card-bg)]',
    style: cssVariables as React.CSSProperties,
  };

  const contextValue: ThemeContextValue = {
    theme,
    cssVariables,
    themeClasses,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div style={cssVariables as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility function to apply theme to any element
export function applyThemeStyles(theme: ProfileTheme): React.CSSProperties {
  return {
    '--color-bg-from': theme.colors.bgGradient[0],
    '--color-bg-to': theme.colors.bgGradient[1],
    '--color-accent': theme.colors.accent,
    '--color-accent-secondary': theme.colors.accentSecondary,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-card-bg': theme.colors.cardBg,
    '--color-card-border': theme.colors.cardBorder,
  } as React.CSSProperties;
}