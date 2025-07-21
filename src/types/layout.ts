// Type definitions for the profile layout system

export interface ProfileTheme {
  name: string;
  colors: {
    bgGradient: [string, string];
    accent: string;
    accentSecondary: string;
    text: string;
    textSecondary: string;
    cardBg: string;
    cardBorder: string;
  };
}

export interface ProfileBlock {
  id: string;
  type: 'header' | 'friends' | 'games' | 'achievements' | 'accounts' | 'custom' | 'about' | 'stream' | 'roster' | 'gallery';
  variant?: string;
  config?: Record<string, any>;
}

export interface ProfileLayout {
  profile_id: string;
  blocks: ProfileBlock[];
  theme: ProfileTheme;
  updated_at: string;
}

// Block variant definitions
export interface BlockVariant {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  config?: Record<string, any>;
}

export interface BlockDefinition {
  type: string;
  name: string;
  description: string;
  icon: string;
  variants: BlockVariant[];
  defaultVariant: string;
}

// Theme preset definitions
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: ProfileTheme['colors'];
}