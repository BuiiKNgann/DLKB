/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5F6FFF",
        seconds: "#9FD7F9",
      },
    },
  },
  plugins: [],
};
