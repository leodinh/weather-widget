"use client";
import React, { useEffect, useState } from "react";
import Loading from "../assets/loading";
import "./weatherapp.css";
import WeatherDetails from "./WeatherDetails";
import { WeatherData } from "@/type";
const api_key = process.env.NEXT_PUBLIC_API_KEY;

function Weatherapp({ city }: { city: string }) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isNight, setIsNight] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Add this function to check if it's night
  const checkIfNight = (
    currentTimestamp: number,
    sunrise: number,
    sunset: number
  ) => currentTimestamp < sunrise * 1000 || currentTimestamp > sunset * 1000;

  useEffect(() => {
    const fetchDefaultWeather = async (city: string) => {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;
      const res = await fetch(url);
      const defaultData = await res.json();
      console.log("defaultData", defaultData);

      setData(defaultData);
      setLoading(false);
    };

    if (city) {
      fetchDefaultWeather(city);
    }
  }, [city]);

  useEffect(() => {
    const updateTime = () => {
      if (data?.timezone && data?.sys) {
        // Use optional chaining
        // Get current UTC time
        const now = new Date();

        // Get the local timezone offset in minutes
        const localOffset = now.getTimezoneOffset() * 60;

        // Calculate the city's time
        const cityTime = new Date(
          now.getTime() + // current timestamp
            data.timezone * 1000 + // API timezone offset in milliseconds
            localOffset * 1000 // Local offset in milliseconds
        );

        // Check if it's night time
        const isNightTime = checkIfNight(
          cityTime.getTime(),
          data.sys.sunrise,
          data.sys.sunset
        );

        setIsNight(isNightTime);

        // Format time as HH:MM:SS
        setCurrentTime(
          cityTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        );
      }
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [data?.timezone, data?.sys]); // Update dependencies with optional chaining

  const weatherImages: { [key: string]: string } = {
    Clear: isNight ? "starry" : "sunny",
    Clouds: isNight ? "starry" : "cloudy",
    Rain: "rainy",
    Snow: "snowy",
    Haze: "stormy",
    Mist: "stormy",
    Drizzle: "rainy",
    Thunderstorm: "stormy",
  };

  const weatherImage = data?.weather ? weatherImages[data.weather[0].main] : "";

  const backgroundImages: { [key: string]: string } = {
    Clear: isNight
      ? "linear-gradient(to right, #0f0f1f, #0c172f)"
      : "linear-gradient(to right, #f3b07c, #fcd283)",
    Clouds: isNight
      ? "linear-gradient(to right, #2c3e50, #3498db)"
      : "linear-gradient(to right, #57d6d4, #71eeec)",
    Rain: isNight
      ? "linear-gradient(to right, #1f1f3a, #2c3e50)"
      : "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: isNight
      ? "linear-gradient(to right, #2c3e50, #34495e)"
      : "linear-gradient(to right, #aff2ff, #fff)",
    Haze: isNight
      ? "linear-gradient(to right, #1a1a2e, #2c3e50)"
      : "linear-gradient(to right, #57d6d4, #71eeec)",
    Mist: isNight
      ? "linear-gradient(to right, #1a1a2e, #2c3e50)"
      : "linear-gradient(to right, #57d6d4, #71eeec)",
    Drizzle: isNight
      ? "linear-gradient(to right, #1f1f3a, #2c3e50)"
      : "linear-gradient(to right, #5bc8fb, #80eaff)",
    Thunderstorm: isNight
      ? "linear-gradient(to right, #141428, #1a1a2e)"
      : "linear-gradient(to right, #5bc8fb, #80eaff)",
  };

  const backgroundImage = data?.weather
    ? backgroundImages[data.weather[0].main]
    : backgroundImages.Clear;

  const currentDate = new Date();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();

  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;
  console.log("currentTime", currentTime);
  return (
    <div
      className="bg-white w-full h-full flex justify-center items-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage || "#fff",
        color: isNight ? "#fff" : "inherit",
      }}
    >
      <div className="w-150 max-w-full flex gap-10 items-center justify-between flex-col lg:flex-row">
        <div
          className="bg-white/20 backdrop-blur-lg shadow-xl w-60 h-60 max-h-[80vh] max-w-[80vh] rounded-[3rem] flex flex-col items-center p-[2rem] box-shadow-[-3rem_1rem_6rem_rgba(0, 0, 0, 0.1)] relative border border-white/10 hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-2xl cursor-pointer"
          onClick={() => setIsDetailsOpen(true)}
        >
          {loading || !data ? (
            <Loading />
          ) : (
            <>
              {weatherImage && (
                <div className={`${weatherImage} top-[-20%] -z-10`} />
              )}
              <div className="text-(--text-color) text-[1.5rem]">
                {data.weather?.[0].main}
              </div>
              <div className="text-(--text-color) text-[2.5rem]">
                {data.main && `${Math.floor(data.main.temp)}°C`}
              </div>
              <div className="text-(--text-secondary-color) text-[1rem] text-center">
                {data.main?.feels_like &&
                  `Feels like ${Math.floor(data.main.feels_like)}°C`}
              </div>
              <div className="flex items-center justify-center text-(--text-color) rounded-full border bg-[#ffffff33] px-4 py-1 border-white/20 hover:bg-[#72727233] cursor-pointer mt-2">
                <h2 className="text-[1rem]">{city}</h2>
              </div>
              {/* <ProgressBar
                backgroundImage={
                  backgroundImage && backgroundImage.replace
                    ? backgroundImage.replace("to right", "to top")
                    : ""
                }
                value={data.main?.humidity ? data.main.humidity : 0}
              /> */}
            </>
          )}
        </div>
        <div className="text-(--text-color) text-[2rem] text-center">
          <p>{formattedDate}</p>
          <p className="mt-2">{currentTime}</p>
        </div>
      </div>

      {data && (
        <WeatherDetails
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          data={data}
        />
      )}
    </div>
  );
}

export default Weatherapp;
