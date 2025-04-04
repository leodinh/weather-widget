"use client";
import Weatherapp from "@/components/weatherapp";
import Location from "@/components/location";
import { useState } from "react";
export default function Home() {
  const [city, setCity] = useState<string>("");
  return (
    <div className="relative h-screen w-screen flex items-center justify-center">
      <Location city={city} setCity={setCity} />
      <Weatherapp city={city} />
    </div>
  );
}
