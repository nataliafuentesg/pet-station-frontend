/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ps-blue': '#152c77', // El azul profundo que elegiste
        'ps-red': '#de1f27',  // El rojo de Pet Station
        'ps-dark': '#0f172a', // Un color oscuro para fondos tipo Netflix
      },
    },
  },
  plugins: [],
}