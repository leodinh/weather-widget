import React from "react";
import Weatherapp from "./components/weatherapp";
import { useLocation } from "./hooks/useLocation";
import ThemeProvider from "./components/theme-provider";
import ThemeToggle from "./components/theme-toggle";
import "./index.css";

function App() {
  const { city } = useLocation();

  return (
    <ThemeProvider>
      <div className="relative h-screen w-screen flex items-center justify-center">
        <Weatherapp city={city} />
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
