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
        'light-theme-bg': '#f4f7fd',
        dark: '#20212c',
        dot0: '#49C4E5',
        dot1: '#8471F2',
        dot2: '#67E2AE',
        dot3: '#e5a449',
        dot4: '#2a3fdb',
        dot5: '#c36e6e',
      },
      borderRadius: {
        xl: '.75rem',
      }
    },
  },
  plugins: [],
  safelist: ['bg-dot0', 'bg-dot1', 'bg-dot2', 'bg-dot3', 'bg-dot4', 'bg-dot5']
}

