"use client";
import { storage } from "../utils/storage";
import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
        storage.set(
          "darkMode",
          JSON.stringify({ theme: theme === "dark" ? "light" : "dark" })
        );
      }}
      className={`fixed top-4 right-4 p-3 transition-all duration-300 text-lg hover:scale-110 z-50`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div
        className={`cursor-pointer transition-all duration-300 ${theme === "dark" ? "brightness-0.4 opacity-60" : "brightness-100 opacity-100"}`}
        id="bulb"
      >
        💡
      </div>
    </button>
  );
}
