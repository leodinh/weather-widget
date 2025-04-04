"use client";
import React, { useEffect, useState } from "react";
import loadingGif from "../assets/loading.gif";
import Humidity from "../assets/humidity";
import Wind from "../assets/wind";
import "./weatherapp.css";
import Image from "next/image";
function Weatherapp({ city }: { city: string }) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isNight, setIsNight] = useState(false);
  const api_key = process.env.NEXT_PUBLIC_API_KEY;

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
      if (data.timezone && data.sys) {
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
  }, [data.timezone, data.sys]);

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

  const weatherImage = data.weather ? weatherImages[data.weather[0].main] : "";

  const backgroundImages: { [key: string]: string } = {
    Clear: isNight
      ? "linear-gradient(to right, #1a1a2e, #16213e)" // Dark blue night gradient
      : "linear-gradient(to right, #f3b07c, #fcd283)", // Original day gradient
    Clouds: isNight
      ? "linear-gradient(to right, #2c3e50, #3498db)" // Dark cloudy night
      : "linear-gradient(to right, #57d6d4, #71eeec)",
    Rain: isNight
      ? "linear-gradient(to right, #1f1f3a, #2c3e50)" // Dark rainy night
      : "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: isNight
      ? "linear-gradient(to right, #2c3e50, #34495e)" // Dark snowy night
      : "linear-gradient(to right, #aff2ff, #fff)",
    Haze: isNight
      ? "linear-gradient(to right, #1a1a2e, #2c3e50)" // Dark hazy night
      : "linear-gradient(to right, #57d6d4, #71eeec)",
    Mist: isNight
      ? "linear-gradient(to right, #1a1a2e, #2c3e50)" // Dark misty night
      : "linear-gradient(to right, #57d6d4, #71eeec)",
    Drizzle: isNight
      ? "linear-gradient(to right, #1f1f3a, #2c3e50)" // Dark drizzly night
      : "linear-gradient(to right, #5bc8fb, #80eaff)",
    Thunderstorm: isNight
      ? "linear-gradient(to right, #141428, #1a1a2e)" // Dark stormy night
      : "linear-gradient(to right, #5bc8fb, #80eaff)",
  };

  const backgroundImage = data.weather
    ? backgroundImages[data.weather[0].main]
    : "linear-gradient(to right, #f3b07c, #fcd283)";

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
        backgroundImage,
        color: isNight ? "#fff" : "inherit", // Adjust text color for night mode
      }}
    >
      <div className="w-150 max-w-full flex gap-10 items-center justify-between flex-col lg:flex-row">
        <div
          className="w-60 h-60 max-h-[80vh] bg-[rgba(255, 255, 255, 0.5)] rounded-[3rem] flex flex-col items-center p-[2rem] box-shadow-[-3rem_1rem_6rem_rgba(0, 0, 0, 0.1)] relative"
          style={{
            backgroundImage:
              backgroundImage && backgroundImage.replace
                ? backgroundImage.replace("to right", "to top")
                : "",
            backdropFilter: "blur(10px)", // Optional: adds a nice blur effect
          }}
        >
          {loading ? (
            <Image
              className="loader"
              src={loadingGif}
              alt="loading"
              unoptimized
            />
          ) : (
            <>
              <div className="relative">
                {weatherImage && (
                  <div className={`${weatherImage} top-[-100%] -z-10`} />
                )}
                <div className="text-(--text-color) text-[2rem]">
                  {data.weather ? data.weather[0].main : null}
                </div>
              </div>
              <div className="text-(--text-color) text-[2.5rem]">
                {data.main ? `${Math.floor(data.main.temp)}°C` : null}
              </div>
              <div className="text-(--text-secondary-color) text-[1rem] text-center">
                {data.main?.feels_like
                  ? `Feels like ${Math.floor(data.main.feels_like)}°C`
                  : null}
              </div>
              <ProgressBar
                backgroundImage={
                  backgroundImage && backgroundImage.replace
                    ? backgroundImage.replace("to right", "to top")
                    : ""
                }
                value={data.main?.humidity ? data.main.humidity : 0}
              />
            </>
          )}
        </div>
        <div className="text-(--text-color) text-[2rem] text-center">
          <p>{formattedDate}</p>
          <p className="mt-2">{currentTime}</p>
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  backgroundImage: string;
  value: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  backgroundImage,
  value,
}) => (
  <div className="flex items-center w-full relative mt-5">
    <span
      className="flex text-(--text-color) px-4 py-2 rounded-full text-sm font-medium absolute"
      style={{ width: `${value}%`, backgroundImage }}
    >
      <Humidity className="w-5 fill-(--text-color)" /> {value}
    </span>
    <div className="flex-1 h-2 bg-(--text-secondary-color) mx-2 rounded-2xl" />
  </div>
);

export default Weatherapp;
