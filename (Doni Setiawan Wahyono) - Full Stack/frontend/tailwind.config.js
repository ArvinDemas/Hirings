/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        moss: "#2f5d50",
        mint: "#dff3ea",
        coral: "#f36f5f",
        gold: "#f2bc57",
        navy: "#0b4f86",
        azure: "#1757d6",
        skyglass: "#dbeeff",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 55px rgba(23, 33, 27, 0.12)",
      },
    },
  },
  plugins: [],
};
