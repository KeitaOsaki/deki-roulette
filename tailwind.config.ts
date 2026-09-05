import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#17111F",
          800: "#1F1829",
          700: "#2A2138",
          600: "#3A2F4C",
          500: "#4C3F62",
          400: "#7D6D96",
        },
        ivory: "#F5EFE6",
        muted: "#A99BBD",
        gold: "#FFC94A",
        flare: "#FF4E63",
      },
      fontFamily: {
        sans: [
          "ui-rounded",
          '"Hiragino Maru Gothic ProN"',
          '"Zen Maru Gothic"',
          '"M PLUS Rounded 1c"',
          '"Segoe UI Variable Display"',
          '"Hiragino Sans"',
          '"Noto Sans JP"',
          '"Yu Gothic UI"',
          "system-ui",
          "sans-serif",
        ],
      },
      keyframes: {
        reveal: {
          from: { opacity: "0", transform: "translateY(6px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        reveal: "reveal 360ms cubic-bezier(0.2, 0.9, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
