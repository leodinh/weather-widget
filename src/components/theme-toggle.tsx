"use client";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDarkMode = theme === "dark";

  return (
    <button
      onClick={toggleDarkMode}
      className="bg-[rgba(255, 255, 255, 0.1)] fixed top-4 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-sm transition-colors"
    >
      {isDarkMode ? "🌙" : "☀️"}
    </button>
  );
}
