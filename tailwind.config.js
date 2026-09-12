/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rpg: {
          dark: '#0a0d14',
          card: '#121826',
          border: '#1f293d',
          gold: '#f59e0b',
          'gold-glow': '#fbbf24',
          strength: '#ef4444',
          intellect: '#3b82f6',
          charisma: '#a855f7',
          creativity: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-strength': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'glow-intellect': '0 0 20px -3px rgba(59, 130, 246, 0.35)',
        'glow-charisma': '0 0 20px -3px rgba(168, 85, 247, 0.35)',
        'glow-creativity': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
