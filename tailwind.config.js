/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,vue}'
  ],
  theme: {

    extend: {
      colors: {
        primary: '#635fc7',
        'primary-light': '#A8A4FF',
        'dark-light': '#2b2c37',
        dark: '#20212c'
      },
      borderRadius: {
        xl: '.75rem',
      }
    },
  },
  plugins: [],
}

