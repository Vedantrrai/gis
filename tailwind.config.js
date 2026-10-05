/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        geo: {
          bg: '#F7F8FA',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          cardHover: '#F7F8FA',
          surface: '#F3F4F6',
          surfaceGreen: '#EAF8F0',
          border: '#E9EBEF',
          borderLight: '#F3F4F6',
          primary: '#16A765',
          primaryDark: '#087D4A',
          lime: '#16A765', // maps to primary green
          limeDark: '#087D4A',
          cyan: '#5B9DE8', // maps to info blue
          cyanDark: '#4182D2',
          orange: '#F2994A',
          red: '#E45B5B',
          blue: '#5B9DE8',
          text: '#17191D',
          secondary: '#777D87',
          muted: '#A0A5AE',
          subtle: '#777D87',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'lg': '10px',
        'xl': '12px',
        '2xl': '14px',
        '3xl': '18px',
      },
      boxShadow: {
        'geo': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'geo-md': '0 4px 12px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
        'geo-glow': '0 1px 2px 0 rgba(22, 167, 101, 0.1)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
}
