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
        bsh: {
          bg: '#F8EFE6',
          surface: '#FFF9F5',
          card: '#FFFFFF',
          subtle: '#F3EAE1',
          hover: '#EADACD',
          border: '#EADACD',
          darkBg: '#0F0D13',
          darkSurface: '#17141E',
          darkCard: '#1E1A28',
          darkSubtle: '#252033',
          darkHover: '#302A42',
          darkBorder: 'rgba(255, 255, 255, 0.14)',
          text: '#231815',
          textMuted: '#685952',
          darkText: '#F7F5F8',
          darkMuted: '#BBB3C5',
          orange: '#E65527',
          terracotta: '#D84C1E',
          gold: '#E65527',
          darkOrange: '#FF7E54',
          darkTerracotta: '#FF6B3B',
        },
        iitm: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#e65527',
          600: '#d84c1e',
          700: '#c43b0e',
          800: '#231815',
          900: '#0f0d13',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'bsh': '0 12px 32px -6px rgba(216, 76, 30, 0.12)',
        'bsh-glow': '0 8px 24px rgba(230, 85, 39, 0.35)',
        'bsh-dark-glow': '0 8px 24px rgba(255, 107, 59, 0.35)',
      },
    },
  },
  plugins: [],
}

