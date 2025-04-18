module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "text-primary": "var(--text-color)",
        "text-secondary": "var(--text-secondary-color)",
        "text-tertiary": "var(--text-third-color)",
      },
    },
  },
  plugins: [],
};
