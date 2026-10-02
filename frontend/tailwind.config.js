/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'], 
        mono: ['"JetBrains Mono"', 'monospace'], 
      },
      colors: {
        arena: {
          dark: '#0f172a',    
          surface: '#1e293b', 
        },
        player1: {
          DEFAULT: '#f59e0b', 
          glow: 'rgba(245, 158, 11, 0.5)'
        },
        player2: {
          DEFAULT: '#8b5cf6', 
          glow: 'rgba(139, 92, 246, 0.5)'
        }
      }
    },
  },
  plugins: [],
}
