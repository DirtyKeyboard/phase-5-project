/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        iris: "#4956DD",
        baby: "#3C86DA",
        babylight: "#4A8FDF",
        teal: "#9DD3C5",
        smoke: "#F1EEEE",
        darksmoke: "#DBDBDB",
        input: "#E4E4E4",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    ],
}