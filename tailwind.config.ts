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
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777', // Primary Pink
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        coin: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Luminous Gold for TumbasCO Koin
          600: '#d97706',
          700: '#b45309',
        },
        slate: {
          850: '#131b2e',
          950: '#080c16',
        },
        mint: {
          50: '#fdf2f8',
          100: '#fce7f3',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
      fontWeight: {
        thin: '300',
        light: '400',
        normal: '500',    // base "normal" = medium weight
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
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
