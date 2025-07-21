/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39FF14',
        // CSS Variables for dynamic theming
        'theme-bg-from': 'var(--color-bg-from)',
        'theme-bg-to': 'var(--color-bg-to)',
        'theme-accent': 'var(--color-accent)',
        'theme-secondary': 'var(--color-secondary)',
        'theme-card-bg': 'var(--color-card-bg)',
        'theme-text': 'var(--color-text)',
        'theme-text-secondary': 'var(--color-text-secondary)',
        'theme-border': 'var(--color-border)',
        'theme-hover': 'var(--color-hover)',
        'theme-surface': 'var(--color-surface)',
      },
      backgroundImage: {
        'theme-gradient': 'linear-gradient(135deg, var(--color-bg-from), var(--color-bg-to))',
      },
      borderColor: {
        'theme-primary': 'var(--color-accent)',
        'theme-secondary': 'var(--color-border)',
      },
      textColor: {
        'theme-primary': 'var(--color-accent)',
        'theme-secondary': 'var(--color-text-secondary)',
      },
    },
  },
  plugins: [],
} 