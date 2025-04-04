"use client";
import React, { useEffect, useState } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  city: string;
}

function Location({
  city,
  setCity,
}: {
  city: string;
  setCity: (city: string) => void;
}) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Try to get saved location data first
    const tryUseSavedLocation = () => {
      const savedLocation = localStorage.getItem("weatherAppLocation");
      if (savedLocation) {
        try {
          const locationData: LocationData = JSON.parse(savedLocation);
          // Check if the data is less than 24 hours old
          const ONE_DAY = 24 * 60 * 60 * 1000;
          if (Date.now() - locationData.timestamp < ONE_DAY) {
            console.log("Using saved location data:", locationData);
            setCity(locationData.city);
            setLoading(false);
            return true;
          }
        } catch (e) {
          console.error("Error parsing saved location:", e);
          localStorage.removeItem("weatherAppLocation"); // Clear invalid data
        }
      }
      return false;
    };

    // If we couldn't use saved location, try to get current location
    if (!tryUseSavedLocation()) {
      if (navigator && navigator.geolocation) {
        // Increase timeout to give more time for location acquisition
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Got position:", position.coords);
            const { latitude, longitude } = position.coords;
            fetchCityFromCoordinates(latitude, longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLoading(false);

            // Handle specific error codes
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setError(
                  "Location access was denied. Please enable location services for this website."
                );
                break;
              case error.POSITION_UNAVAILABLE:
                setError(
                  "Location information is unavailable. Please try again later."
                );
                break;
              case error.TIMEOUT:
                setError(
                  "Location request timed out. Please check your connection and try again."
                );
                break;
              default:
                setError(`Error getting your location: ${error.message}`);
            }

            // Try to use saved location as fallback even if it's older than 24 hours
            const savedLocation = localStorage.getItem("weatherAppLocation");
            if (savedLocation) {
              try {
                const locationData: LocationData = JSON.parse(savedLocation);
                setCity(locationData.city);
                setError((error) => error + " Using last known location.");
              } catch (e) {
                // If we can't parse saved data, we already have an error message set
              }
            }
          },
          {
            enableHighAccuracy: false, // Set to false to improve success rate
            timeout: 10000, // Increase timeout to 10 seconds
            maximumAge: 60000, // Accept positions up to 1 minute old
          }
        );
      } else {
        setLoading(false);
        setError(
          "Geolocation is not supported by your browser. Please try a different browser."
        );
      }
    }
  }, []);

  const fetchCityFromCoordinates = (latitude: number, longitude: number) => {
    console.log("Fetching city from coordinates:", latitude, longitude);
    // Call the reverse geocoding API
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Extract city information
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.hamlet ||
          data.address.county ||
          "Unknown location";

        console.log("City:", city);

        const locationData: LocationData = {
          latitude,
          longitude,
          timestamp: Date.now(),
          city,
        };

        localStorage.setItem(
          "weatherAppLocation",
          JSON.stringify(locationData)
        );
        console.log("Saved new location to localStorage", locationData);
        setCity(city);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting location name:", error);
        setError("Could not determine your city. Please try again later.");
        setLoading(false);
      });
  };

  return (
    <div className="absolute top-10 right-10 flex items-center justify-center text-(--text-color) rounded-full border bg-[#ffffff33] px-3 border-(--text-color) hover:bg-[#72727233] cursor-pointer">
      {loading ? (
        <div className="text-center">
          <div className="animate-pulse">...</div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl">{city}</h2>
        </div>
      )}
    </div>
  );
}

export default Location;
