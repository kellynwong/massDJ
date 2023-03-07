/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using src directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        myNerve: ['"Mynerve"'],
        leagueSpartan: ['"LeagueSpartan"'],
        notoSansSc: ['"NotoSansSC"'],
        dosis: ['"Dosis"'],
        barlow: ['"Barlow"'],
        hind: ['"Hind"'],
      },
    },
  },
  plugins: [],
};
