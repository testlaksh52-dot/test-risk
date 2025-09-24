/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "navy-dark": "#09233d",
        "navy-darker": "#0e1b2b",
        "navy-light": "#1a3a5c",
        "cora-blue": "#3170f9",
        "cora-red": "#dc2626",
        "cora-orange": "#fde68a",
        "cora-green": "#059669",
        "cora-yellow": "#f59e0b",
        "cora-gray": "#718096",
        "text-primary": "#ffffff",
        "text-secondary": "#ffffffb3",
        glass: "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.12)",
        "glass-dark": "rgba(0, 0, 0, 0.08)",
        "glass-light": "rgba(255, 255, 255, 0.08)",
        "glass-hover": "rgba(255, 255, 255, 0.12)",
        "glass-aurora": "rgba(255, 255, 255, 0.03)",
        "glass-mystic": "rgba(255, 255, 255, 0.06)",
        "glass-shadow": "rgba(0, 0, 0, 0.15)",
        // Specific opaque styles for dropdowns, modals, and date pickers
        "modal-bg": "rgba(14, 27, 43, 0.95)",
        "modal-input": "rgba(26, 58, 92, 0.80)",
        "dropdown-bg": "rgba(14, 27, 43, 0.95)",
        "dropdown-hover": "rgba(26, 58, 92, 0.60)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        markdown: "24px",
      },
      fontWeight: {
        markdown: "400",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))",
        "glass-dark-gradient":
          "linear-gradient(135deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.06))",
        "glass-premium":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02))",
        "glass-aurora":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))",
        "glass-mystic":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02))",
        "glass-shadow":
          "linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1))",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
