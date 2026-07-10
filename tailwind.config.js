/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './index.js', './i18n.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      colors: {
        // #0069d9 da 5.2:1 sobre blanco (AA para texto normal); #007bff solo daba 3.98:1
        primary: '#0069d9',
        primarydark: '#0056b3',
        secondary: '#6c757d',
        lightgray: '#f8f9fa',
        darkgray: '#343a40',
      },
    },
  },
  plugins: [],
};
