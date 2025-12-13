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
        glow: "0 0 20px rgba(26, 115, 232, 0.3)",
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "Roboto", "Arial", "sans-serif"],
      },
      fontSize: {
        "subtitle-1": ["1rem", { lineHeight: "1.75rem", fontWeight: "400" }],
        "body-2": ["0.875rem", { lineHeight: "1.25rem", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.25rem", fontWeight: "400" }],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "shimmer": "shimmer 2s infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "ripple": "ripple 0.6s ease-out",
        "star-fill": "starFill 0.4s ease-out forwards",
        "sparkle": "sparkle 1s ease-out",
        "float": "float 3s ease-in-out infinite",
        "shine": "shine 2s infinite",
        "tilt": "tilt 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        starFill: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(180deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "1" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shine: {
          "0%": { left: "-100%" },
          "100%": { left: "200%" },
        },
        tilt: {
          "0%, 100%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(5deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
