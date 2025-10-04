/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f7fa',   // Very light Zigo blue
          100: '#b2ebf2',  // Lighter Zigo blue
          200: '#80deea',  // Zigo light blue (for dots, accents)
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#25B0C4',  // Zigo main blue (for buttons, logo outline)
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'zigo-dark-text': '#1A1A1A',   // For main headings
        'zigo-medium-text': '#4A4A4A', // For subheadings and navigation
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
