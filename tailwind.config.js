/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./src/**/*.html",
      "./src/**/*.vue",
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
