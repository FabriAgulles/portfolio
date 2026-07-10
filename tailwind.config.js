/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './index.js', './i18n.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#007bff',
        primarydark: '#0056b3',
        secondary: '#6c757d',
        lightgray: '#f8f9fa',
        darkgray: '#343a40',
      },
    },
  },
  plugins: [],
};
