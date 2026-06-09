import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        destructive: "hsl(var(--destructive))",
        success: "hsl(var(--success))"
      },
      boxShadow: {
        soft: "0 20px 70px -35px rgba(15, 23, 42, 0.35)",
        glow: "0 0 50px rgba(37, 99, 235, 0.22)"
      },
      keyframes: {
        pulseWave: {
          "0%, 100%": { transform: "scaleY(.35)" },
          "50%": { transform: "scaleY(1)" }
        }
      },
      animation: {
        pulseWave: "pulseWave 1s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
