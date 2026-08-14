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
          50: '#fff4f0',
          100: '#ffe6dc',
          200: '#ffcfbd',
          300: '#ffa88f',
          400: '#ff7754',
          500: '#ff471a', // Electric Vermilion primary
          600: '#f03107',
          700: '#c82403',
          800: '#9e1f08',
          900: '#801e0d',
          950: '#460b03',
        },
        slate: {
          850: '#151f32',
          950: '#070b14',
        },
        mint: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Inter', 'sans-serif'],
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 25px rgba(255, 71, 26, 0.25)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.3)',
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
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        marquee: 'marquee 25s linear infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
