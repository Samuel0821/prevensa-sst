/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Paleta corporativa PREVENSA SST — sobria y profesional
        prevensa: {
          blue: "#1E40AF",       // Azul principal (botones y títulos)
          blueLight: "#3B82F6",  // Azul claro para hover o acentos
          blueDark: "#0F2557",   // Azul profundo para header/navbar
          sky: "#E5EEFB",        // Azul muy suave para fondos
          gray: "#F3F4F6",       // Gris claro institucional
          neutral: "#E2E8F0",    // Gris azulado para bordes / fondos secundarios
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      boxShadow: {
        card: "0 2px 6px rgba(0, 0, 0, 0.08)",
        subtle: "0 1px 3px rgba(0, 0, 0, 0.04)",
      },

      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
