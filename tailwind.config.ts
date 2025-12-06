import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#01875f",
        background: "#ffffff",
        surface: "#f6f8fc",
        surfaceContainer: "#ffffff",
        ink: "#202124",
        muted: "#5f6368",
      },
      boxShadow: {
        card:
          "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
