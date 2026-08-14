import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Distinctive COinaja Palette: Electric Indigo + Golden Coin
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#4f46e5', // Primary Electric Indigo (Distinct from Shopee orange)
          600: '#4338ca',
          700: '#3730a3',
          800: '#312e81',
          900: '#1e1b4b',
          950: '#0f0e26',
        },
        coin: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Luminous Gold for COinaja Koin
          600: '#d97706',
          700: '#b45309',
        },
        slate: {
          850: '#131b2e',
          950: '#080c16',
        },
        mint: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 12px rgba(0, 0, 0, 0.04)',
        'elevated': '0 12px 32px -4px rgba(79, 70, 229, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 25px rgba(79, 70, 229, 0.25)',
        'glow-coin': '0 0 25px rgba(245, 158, 11, 0.35)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        coinPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15) rotate(10deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        marquee: 'marquee 25s linear infinite',
        float: 'float 4s ease-in-out infinite',
        'coin-pulse': 'coinPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
