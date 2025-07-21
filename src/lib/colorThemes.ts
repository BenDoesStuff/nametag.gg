// Color theme system for Nametag profile customization

export interface ColorTheme {
  primary: string;        // Hex color (e.g., "#39FF14")
  primaryRgb: string;    // RGB values for CSS (e.g., "57, 255, 20")
  themeName: string;     // Internal theme identifier
  displayName: string;   // Human-readable name
  description: string;   // Theme description
}

// Predefined color themes
export const PREDEFINED_THEMES: Record<string, ColorTheme> = {
  'neon-green': {
    primary: '#39FF14',
    primaryRgb: '57, 255, 20',
    themeName: 'neon-green',
    displayName: 'Neon Green',
    description: 'Classic gaming neon green (default)'
  },
  'electric-blue': {
    primary: '#0080FF',
    primaryRgb: '0, 128, 255',
    themeName: 'electric-blue',
    displayName: 'Electric Blue',
    description: 'Cool electric blue energy'
  },
  'cyber-purple': {
    primary: '#8A2BE2',
    primaryRgb: '138, 43, 226',
    themeName: 'cyber-purple',
    displayName: 'Cyber Purple',
    description: 'Futuristic cyberpunk purple'
  },
  'blazing-orange': {
    primary: '#FF6B35',
    primaryRgb: '255, 107, 53',
    themeName: 'blazing-orange',
    displayName: 'Blazing Orange',
    description: 'Energetic flame orange'
  },
  'hot-pink': {
    primary: '#FF1493',
    primaryRgb: '255, 20, 147',
    themeName: 'hot-pink',
    displayName: 'Hot Pink',
    description: 'Vibrant hot pink power'
  },
  'arctic-cyan': {
    primary: '#00FFFF',
    primaryRgb: '0, 255, 255',
    themeName: 'arctic-cyan',
    displayName: 'Arctic Cyan',
    description: 'Cool arctic cyan ice'
  },
  'golden-yellow': {
    primary: '#FFD700',
    primaryRgb: '255, 215, 0',
    themeName: 'golden-yellow',
    displayName: 'Golden Yellow',
    description: 'Legendary golden glow'
  },
  'blood-red': {
    primary: '#DC143C',
    primaryRgb: '220, 20, 60',
    themeName: 'blood-red',
    displayName: 'Blood Red',
    description: 'Intense crimson red'
  },
  'lime-green': {
    primary: '#32CD32',
    primaryRgb: '50, 205, 50',
    themeName: 'lime-green',
    displayName: 'Lime Green',
    description: 'Fresh lime green energy'
  },
  'royal-purple': {
    primary: '#7B68EE',
    primaryRgb: '123, 104, 238',
    themeName: 'royal-purple',
    displayName: 'Royal Purple',
    description: 'Majestic royal purple'
  },
  'sunset-coral': {
    primary: '#FF7F50',
    primaryRgb: '255, 127, 80',
    themeName: 'sunset-coral',
    displayName: 'Sunset Coral',
    description: 'Warm sunset coral glow'
  },
  'matrix-green': {
    primary: '#00FF41',
    primaryRgb: '0, 255, 65',
    themeName: 'matrix-green',
    displayName: 'Matrix Green',
    description: 'Digital matrix green code'
  }
};

// Default theme
export const DEFAULT_THEME = PREDEFINED_THEMES['neon-green'];

// Helper functions
export function hexToRgb(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

export function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

export function createCustomTheme(hex: string, displayName?: string): ColorTheme {
  if (!isValidHex(hex)) {
    throw new Error('Invalid hex color format');
  }
  
  return {
    primary: hex.toUpperCase(),
    primaryRgb: hexToRgb(hex),
    themeName: `custom-${hex.replace('#', '').toLowerCase()}`,
    displayName: displayName || `Custom ${hex}`,
    description: 'Custom color theme'
  };
}

export function getThemeById(themeId: string): ColorTheme {
  return PREDEFINED_THEMES[themeId] || DEFAULT_THEME;
}

export function getAllThemes(): ColorTheme[] {
  return Object.values(PREDEFINED_THEMES);
}

// CSS custom properties generator
export function generateThemeCSS(theme: ColorTheme): Record<string, string> {
  return {
    '--color-primary': theme.primary,
    '--color-primary-rgb': theme.primaryRgb,
    '--color-primary-10': `rgba(${theme.primaryRgb}, 0.1)`,
    '--color-primary-20': `rgba(${theme.primaryRgb}, 0.2)`,
    '--color-primary-30': `rgba(${theme.primaryRgb}, 0.3)`,
    '--color-primary-50': `rgba(${theme.primaryRgb}, 0.5)`,
    '--color-primary-80': `rgba(${theme.primaryRgb}, 0.8)`,
  };
}

// Tailwind class name generator for dynamic colors
export function getThemeClasses(theme: ColorTheme) {
  const style = generateThemeCSS(theme);
  
  return {
    // Text colors
    textPrimary: 'text-[var(--color-primary)]',
    textPrimaryHover: 'hover:text-[var(--color-primary)]',
    
    // Background colors
    bgPrimary: 'bg-[var(--color-primary)]',
    bgPrimary10: 'bg-[var(--color-primary-10)]',
    bgPrimary20: 'bg-[var(--color-primary-20)]',
    bgPrimary50: 'bg-[var(--color-primary-50)]',
    
    // Border colors
    borderPrimary: 'border-[var(--color-primary)]',
    borderPrimary2: 'border-2 border-[var(--color-primary)]',
    borderPrimary4: 'border-4 border-[var(--color-primary)]',
    
    // Hover states
    hoverBgPrimary: 'hover:bg-[var(--color-primary)]',
    hoverBorderPrimary: 'hover:border-[var(--color-primary)]',
    
    // Focus states
    focusBorderPrimary: 'focus:border-[var(--color-primary)]',
    
    // CSS style object
    style
  };
}