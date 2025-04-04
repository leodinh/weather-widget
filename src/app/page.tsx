"use client";
import Weatherapp from "@/components/weatherapp";
// import ThemeToggle from "@/components/theme-toggle";
import { useLocation } from "@/hooks/useLocation";
export default function Home() {
  const { city } = useLocation();
  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      <Weatherapp city={city} />
      {/* <ThemeToggle /> */}
    </div>
  );
}
