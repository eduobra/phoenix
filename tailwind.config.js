/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enable dark mode using the 'dark' class
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F9FAFB", // Light background
          dark: "#1E1E1E",     // Soft dark gray background (like ChatGPT)
        },
        foreground: {
          DEFAULT: "#111827", // Dark text (light mode)
          dark: "#E5E7EB",    // Light text (dark mode)
        },
        card: {
          DEFAULT: "#FFFFFF", // Card background (light mode)
          dark: "#2A2A2A",    // Card background (dark mode)
        },
        "card-foreground": {
          DEFAULT: "#111827",
          dark: "#F3F4F6",
        },
        border: {
          DEFAULT: "#E5E7EB",
          dark: "#3A3A3A",
        },
        primary: {
          DEFAULT: "#4F46E5", // Indigo 600
          dark: "#6366F1",    // Indigo 500 (slightly brighter in dark mode)
        },

        // ✨ Accent colors (for user message bubbles)
        accent: {
          blue: "#3B82F6", // Tailwind Blue-500
          violet: "#8B5CF6", // Tailwind Violet-500
          slate: "#64748B", // Tailwind Slate-500
        },
      },
    },
  },

  // ✨ Plugin to support [data-accent="blue|violet|slate"]
  plugins: [
    function ({ addVariant }) {
      addVariant("accent-blue", '&[data-accent="blue"] &');
      addVariant("accent-violet", '&[data-accent="violet"] &');
      addVariant("accent-slate", '&[data-accent="slate"] &');
    },
  ],
};
