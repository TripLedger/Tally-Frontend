import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0A0A0F",
          card: "#13131A",
          elevated: "#1C1C27",
        },
        accent: {
          violet: "#7C3AED",
          cobalt: "#2563EB",
        },
        semantic: {
          green: "#10B981",
          rose: "#F43F5E",
        },
        text: {
          primary: "#F8F8FF",
          secondary: "#94A3B8",
          disabled: "#475569",
        },
        border: {
          glass: "#ffffff0f",
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
        input: "12px",
        pill: "999px",
      },
      transitionTimingFunction: {
        tally: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "250ms",
        slow: "400ms",
      },
      maxWidth: {
        mobile: "430px",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)",
      },
      boxShadow: {
        glow: "0 0 24px rgba(124, 58, 237, 0.35)",
        "float-nav": "0 -4px 24px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
