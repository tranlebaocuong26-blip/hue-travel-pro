import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core Design Tokens from Master Spec Section 3.3
        lavender: "#C2C6FA",
        "deep-violet": "#4D3087",
        "soft-purple": "#9075F4",
        "electric-lime": "#CAFA35",
        "off-white": "#FAFAFC",
        "dark-ink": "#251C39",
        // Extended palette variants from mockup
        "warm-lavender": "#E8DDF5",
        "imperial-plum": "#513568",
        "warm-ivory": "#FFF9F2",
        "warm-gold": "#F2C675",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-ui)", "'Segoe UI'", "Arial", "sans-serif"],
        serif: ["'Segoe UI'", "Georgia", "serif"],
        ui: ["var(--font-ui)", "'Segoe UI'", "Arial", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        brand: ["var(--font-sans)", "'Segoe UI'", "Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
