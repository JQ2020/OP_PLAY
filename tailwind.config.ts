import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#01875f",
        "primary-blue": "#1a73e8",
        background: "#ffffff",
        surface: "#ffffff",
        "surface-variant": "#f8f9fa",
        surfaceContainer: "#ffffff",
        ink: "rgba(0, 0, 0, 0.87)",
        "ink-secondary": "rgba(0, 0, 0, 0.54)",
        "ink-tertiary": "rgba(0, 0, 0, 0.38)",
        muted: "#5f6368",
        border: "#dadce0",
        "border-light": "#e8eaed",
        divider: "rgba(0, 0, 0, 0.12)",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
        sm: "0 1px 2px 0 rgba(60,64,67,0.3)",
        md: "0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)",
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "Roboto", "Arial", "sans-serif"],
      },
      fontSize: {
        "subtitle-1": ["1rem", { lineHeight: "1.75rem", fontWeight: "400" }],
        "body-2": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.25rem", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};

export default config;
