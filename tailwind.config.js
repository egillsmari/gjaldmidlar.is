/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      // ...existing code...
    },
    extend: {
      animation: {
        "shimmer-fast": "shimmer 1s",
      },
      keyframes: {
        "accordion-down": {
          // ...existing code...
        },
        "accordion-up": {
          // ...existing code...
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      // ...existing code...
    },
  },
  // ...existing code...
};
