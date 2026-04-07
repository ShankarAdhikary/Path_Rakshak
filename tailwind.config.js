/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emergency: { DEFAULT: '#dc2626', dark: '#991b1b', light: '#fca5a5' },
        safe: '#16a34a',
        warning: '#d97706',
        surface: '#1a1a2e',
        card: '#16213e',
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
