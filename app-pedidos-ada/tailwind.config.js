/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4B5563", // gris oscuro
          secondary: "#6B7280", // gris medio
          accent: "#9CA3AF", // gris claro
          neutral: "#D1D5DB", // gris muy claro
          "base-100": "#F3F4F6", // fondo blanco-gris
          info: "#E5E7EB", // gris pálido
          success: "#9CA3AF", // gris claro
          warning: "#6B7280", // gris medio
          error: "#4B5563", // gris oscuro
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
