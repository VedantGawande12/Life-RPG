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
        sanctum: {
          void: '#030508',       // Deepest abyss background
          obsidian: '#070a10',   // Dark polished volcanic glass
          stone: '#0f141d',      // Weathered cathedral masonry
          slate: '#161c28',      // Chiseled ashlar block
          plate: '#1e2535',      // Forged iron / bronze backing
          border: 'rgba(255, 255, 255, 0.07)',
          'border-bronze': 'rgba(138, 98, 48, 0.35)',
          'border-gold': 'rgba(197, 155, 39, 0.28)',
          gold: '#c59b27',
          'gold-bright': '#e2bc49',
          'gold-muted': '#785b18',
          bronze: '#8a6230',
          'bronze-light': '#b58b4c',
          ivory: '#dcd7cc',      // Ancient aged parchment script
          ash: '#838e9e',        // Weathered stone dust
          crimson: '#8f2828',    // Strength - blood oath red
          arcane: '#254b79',     // Intellect - deep cathedral blue
          violet: '#58366d',     // Charisma - imperial twilight
          emerald: '#1e5941',    // Creativity - eldritch moss
        },
        chronicon: {
          void: '#030509',
          abyss: '#060911',
          slate: '#0a0e1a',
          card: '#0d1222',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-gold': 'rgba(197, 155, 39, 0.35)',
          gold: '#c59b27',
          'gold-bright': '#dfb743',
          'gold-muted': '#8c6e1e',
          ivory: '#e4e4e7',
          ash: '#94a3b8',
          blood: '#a82828',
          frost: '#38bdf8',
          spectral: '#c084fc',
          eldritch: '#34d399',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
        covenant: ['"Cinzel Decorative"', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        monument: '0.28em',
        frieze: '0.18em',
      },
      boxShadow: {
        'rune-gold': '0 0 25px -4px rgba(197, 155, 39, 0.22)',
        'soul-glow': '0 0 35px -8px rgba(197, 155, 39, 0.16)',
        'sanctum-ambient': '0 20px 50px -10px rgba(0, 0, 0, 0.85)',
        'intaglio': 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.8), inset 0 -1px 0 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
}
