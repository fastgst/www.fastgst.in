/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,njk,md,js}",
    "./src/_includes/**/*.njk",
    "./src/_layouts/**/*.njk"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Inter Fallback', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: 'rgb(34 197 94)',
          600: 'rgb(22 163 74)',
          700: 'rgb(21 128 61)',
          800: '#166534',
          900: '#14532d',
        }
      }
    }
  },
  plugins: [],
}

