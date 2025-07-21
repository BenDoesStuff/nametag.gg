import { ThemePreset, ProfileTheme } from '@/types/layout';

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'neonBlue',
    name: 'Neon Blue',
    description: 'Electric blue with dark gradients',
    colors: {
      bgGradient: ['#0f172a', '#1e293b'],
      accent: '#3b82f6',
      accentSecondary: '#1d4ed8',
      text: '#ffffff',
      textSecondary: '#94a3b8',
      cardBg: '#1e293b80',
      cardBorder: '#37415150'
    }
  },
  {
    id: 'neonGreen',
    name: 'Neon Green',
    description: 'Matrix-style green on black',
    colors: {
      bgGradient: ['#0c0c0c', '#1a1a1a'],
      accent: '#39ff14',
      accentSecondary: '#00ff00',
      text: '#ffffff',
      textSecondary: '#a3a3a3',
      cardBg: '#1a1a1a80',
      cardBorder: '#39ff1430'
    }
  },
  {
    id: 'cyberPurple',
    name: 'Cyber Purple',
    description: 'Futuristic purple and pink',
    colors: {
      bgGradient: ['#1a0033', '#2d1b4e'],
      accent: '#a855f7',
      accentSecondary: '#ec4899',
      text: '#ffffff',
      textSecondary: '#c4b5fd',
      cardBg: '#2d1b4e80',
      cardBorder: '#a855f730'
    }
  },
  {
    id: 'retroPink',
    name: 'Retro Pink',
    description: 'Synthwave pink and orange',
    colors: {
      bgGradient: ['#1a0d1a', '#330a2e'],
      accent: '#ff1493',
      accentSecondary: '#ff6b35',
      text: '#ffffff',
      textSecondary: '#ffb3d9',
      cardBg: '#330a2e80',
      cardBorder: '#ff149330'
    }
  },
  {
    id: 'neonOrange',
    name: 'Neon Orange',
    description: 'Vibrant orange energy',
    colors: {
      bgGradient: ['#1a0f00', '#331a00'],
      accent: '#ff6600',
      accentSecondary: '#ff4500',
      text: '#ffffff',
      textSecondary: '#ffcc99',
      cardBg: '#331a0080',
      cardBorder: '#ff660030'
    }
  },
  {
    id: 'iceBlue',
    name: 'Ice Blue',
    description: 'Cool arctic blues',
    colors: {
      bgGradient: ['#0a0e1a', '#1a2233'],
      accent: '#00bfff',
      accentSecondary: '#1e90ff',
      text: '#ffffff',
      textSecondary: '#b3e5ff',
      cardBg: '#1a223380',
      cardBorder: '#00bfff30'
    }
  }
];

export const DEFAULT_THEME: ProfileTheme = {
  name: 'neonBlue',
  colors: THEME_PRESETS[0].colors
};

export function getThemeByName(name: string): ProfileTheme {
  const preset = THEME_PRESETS.find(p => p.id === name);
  return preset ? { name, colors: preset.colors } : DEFAULT_THEME;
}

export function createCustomTheme(colors: Partial<ProfileTheme['colors']>): ProfileTheme {
  return {
    name: 'custom',
    colors: {
      ...DEFAULT_THEME.colors,
      ...colors
    }
  };
}

export function createTheme(colors: ProfileTheme['colors']): ProfileTheme {
  return {
    name: 'custom',
    colors
  };
}