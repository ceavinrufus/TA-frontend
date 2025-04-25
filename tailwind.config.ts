import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          placeholder: "#B0B0B0",
          success: "#89A373",
          error: "#BB563A",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        "green-success": "#EAEFE6",
        "red-error": "#FFE8E8",
      },
      backgroundImage: {
        noise: "url('/noise.svg')",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "neumorphic-card-up":
          "-6px -6px 12px 0px rgba(255, 255, 255, 0.80), 6px 6px 12px 0px rgba(26, 26, 26, 0.20)",
        "neumorphic-card-down":
          "-6px -6px 12px 0px rgba(255, 255, 255, 0.80) inset, 6px 6px 12px 0px rgba(26, 26, 26, 0.20) inset",
        "button-up":
          "-4px -4px 8px 0px rgba(255, 255, 255, 0.80), 4px 4px 8px 0px rgba(73, 76, 72, 0.40)",
        "button-down":
          "-3px -3px 3px 0px rgba(255, 255, 255, 0.60) inset, 3px 3px 3px 0px rgba(92, 94, 97, 0.40) inset",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
