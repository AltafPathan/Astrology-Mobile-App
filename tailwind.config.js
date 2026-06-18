/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        astro: {
          bg: "#1A103D",
          deep: "#120B2C",
          gold: "#F4C95D",
          goldDark: "#E5B743",
          text: "#1A103D",
        }
      }
    },
  },
  plugins: [],
}
