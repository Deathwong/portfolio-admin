/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        purple: {
          50:  '#fdf4ff',
          100: '#f8e8ff',
          200: '#f0d0ff',
          400: '#c770f0',
          500: '#b050d8',
          600: '#8b3ab0',
          700: '#623686',
        },
      },
    },
  },
  plugins: [],
}
