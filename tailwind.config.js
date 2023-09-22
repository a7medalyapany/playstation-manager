/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    // enabled: process.env.NODE_ENV === "production",
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
