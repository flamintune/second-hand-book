/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        'safe-top': 'var(--safe-area-top)',
        'safe-right': 'var(--safe-area-right)',
        'safe-bottom': 'var(--safe-area-bottom)',
        'safe-left': 'var(--safe-area-left)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.safe-area-top': {
          paddingTop: 'var(--safe-area-top)',
        },
        '.safe-area-right': {
          paddingRight: 'var(--safe-area-right)',
        },
        '.safe-area-bottom': {
          paddingBottom: 'var(--safe-area-bottom)',
        },
        '.safe-area-left': {
          paddingLeft: 'var(--safe-area-left)',
        },
        '.safe-area-x': {
          paddingLeft: 'var(--safe-area-left)',
          paddingRight: 'var(--safe-area-right)',
        },
        '.safe-area-y': {
          paddingTop: 'var(--safe-area-top)',
          paddingBottom: 'var(--safe-area-bottom)',
        },
        '.safe-area': {
          paddingTop: 'var(--safe-area-top)',
          paddingRight: 'var(--safe-area-right)',
          paddingBottom: 'var(--safe-area-bottom)',
          paddingLeft: 'var(--safe-area-left)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}