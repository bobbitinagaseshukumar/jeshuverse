/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F4E8C1',
          DEFAULT: '#D4AF37', // metallic gold
          dark: '#AA7C11',
          soft: '#DFBA4F',
          pale: '#FAF6E8',
        },
        dark: {
          light: '#2d2d2d',
          DEFAULT: '#111111',
          dark: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
