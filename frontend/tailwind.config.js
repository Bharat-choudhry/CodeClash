/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        lc: {
          bg: '#1a1a1a',
          sidebar: '#282828',
          card: '#282828',
          border: '#3e3e3e',
          text: '#eff1f6',
          muted: '#8a8a8a',
          accent: '#ffa116',
          'accent-hover': '#ffb84d',
          green: '#00b8a3',
          red: '#ef4743',
          blue: '#5192ff',
          purple: '#c084fc',
          easy: '#00b8a3',
          medium: '#ffa116',
          hard: '#ef4743',
        },
        arena: {
          dark: '#1a1a1a',
          surface: '#282828',
          border: '#3e3e3e',
        },
        player1: { DEFAULT: '#ffa116', glow: 'rgba(255,161,22,0.4)' },
        player2: { DEFAULT: '#5192ff', glow: 'rgba(81,146,255,0.4)' },
      },
      boxShadow: {
        'lc': '0 1px 3px rgba(0,0,0,0.4)',
        'lc-hover': '0 4px 12px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
