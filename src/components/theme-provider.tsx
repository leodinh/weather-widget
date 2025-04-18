import { storage } from "../utils/storage";
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const init = async () => {
      const darkMode = await storage.get("darkMode");
      if (darkMode) {
        setTheme(darkMode as Theme);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addListener(handleSystemThemeChange);

    // Initial setup
    if (theme === "system") {
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }

    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
