/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#0B0F19',
          card: '#151C2C',
          cardLight: '#FFFFFF',
          purple: '#8B5CF6',
          teal: '#14B8A6',
          amber: '#F59E0B',
          coral: '#EF4444',
          emerald: '#10B981',
          indigo: '#6366F1',
        },
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'game-purple': '0 6px 0 0 #6D28D9',
        'game-purple-sm': '0 4px 0 0 #6D28D9',
        'game-teal': '0 6px 0 0 #0D9488',
        'game-teal-sm': '0 4px 0 0 #0D9488',
        'game-amber': '0 6px 0 0 #D97706',
        'game-amber-sm': '0 4px 0 0 #D97706',
        'game-coral': '0 6px 0 0 #DC2626',
        'game-emerald': '0 6px 0 0 #059669',
        'game-emerald-sm': '0 4px 0 0 #059669',
        'game-gray': '0 6px 0 0 #374151',
        'game-gray-sm': '0 4px 0 0 #374151',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
};
