import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        terracotta: {
          50: "#fdf4ef", 100: "#fae5d8", 200: "#f4c8af", 300: "#eca57c",
          400: "#e37d4a", 500: "#c45c26", 600: "#b44a1f", 700: "#96391c",
          800: "#79301d", 900: "#642a1b",
        },
        sage: {
          50: "#f4f8f4", 100: "#e6efe6", 200: "#cddece", 300: "#a6c4a9",
          400: "#7a9e7e", 500: "#5a8160", 600: "#46674b", 700: "#39533e",
          800: "#304434", 900: "#28382c",
        },
        cream: {
          50: "#fdfcfa", 100: "#f9f6f1", 200: "#f5f0e8", 300: "#ebe3d6",
          400: "#ddd1be", 500: "#c9b89f", 600: "#b39e7e", 700: "#968267",
          800: "#7a6b56", 900: "#655948",
        },
        charcoal: {
          50: "#f5f5f4", 100: "#e6e5e3", 200: "#cfcdca", 300: "#b1aea9",
          400: "#928d86", 500: "#77726c", 600: "#605c57", 700: "#4e4a46",
          800: "#413e3b", 900: "#2d2926",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
