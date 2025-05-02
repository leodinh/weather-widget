import { storage } from "../utils/storage";
import { useState, useEffect } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  city: string;
}

export function useLocation() {
  const [city, setCity] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const requestGeolocation = async (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          console.error("Geolocation error:", error);
          if (error.code === error.PERMISSION_DENIED) {
            reject(
              new Error(
                "Geolocation permission denied. Please enable location access in your browser settings."
              )
            );
          } else if (error.code === error.TIMEOUT) {
            reject(new Error("Location request timed out. Please try again."));
          } else {
            reject(new Error("Unable to get location. Please try again."));
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  useEffect(() => {
    const tryUseSavedLocation = async () => {
      const savedLocation = await storage.get("weatherAppLocation");
      if (savedLocation) {
        try {
          const locationData: LocationData = JSON.parse(
            savedLocation as string
          );
          const ONE_DAY = 24 * 60 * 60 * 1000;
          if (Date.now() - locationData.timestamp < ONE_DAY) {
            console.log("Using saved location data:", locationData);
            setCity(locationData.city);
            setLoading(false);
            return true;
          }
        } catch (e) {
          console.error("Error parsing saved location:", e);
          await storage.remove("weatherAppLocation");
        }
      }
      return false;
    };

    const fetchCityFromCoordinates = async (
      latitude: number,
      longitude: number
    ) => {
      console.log("Fetching city from coordinates:", latitude, longitude);

      // Try multiple geocoding services with fallback
      const tryGeocodingServices = async () => {
        // Try OpenWeatherMap's built-in geocoding (since you're already using their API)
        try {
          const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
          const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

          const response = await fetch(url);
          if (!response.ok)
            throw new Error(
              `OpenWeatherMap geocoding failed: ${response.status}`
            );

          const data = await response.json();
          if (data && data.length > 0) {
            return data[0].name || "Unknown location";
          }
          throw new Error("No results from OpenWeatherMap geocoding");
        } catch (error) {
          console.error("OpenWeatherMap geocoding failed:", error);

          // Fallback to a hardcoded solution based on coordinates
          // This is very basic but will work when all APIs fail
          return getApproximateLocationName(latitude, longitude);
        }
      };

      // Very basic function to get approximate location based on coordinates
      const getApproximateLocationName = (lat: number, lon: number) => {
        // This is a very simplified approach
        // You could expand this with a more comprehensive database of major cities
        const majorCities = [
          { name: "New York", lat: 40.7128, lon: -74.006, radius: 0.5 },
          { name: "London", lat: 51.5074, lon: -0.1278, radius: 0.5 },
          { name: "Tokyo", lat: 35.6762, lon: 139.6503, radius: 0.5 },
          { name: "Paris", lat: 48.8566, lon: 2.3522, radius: 0.5 },
          // Add more cities as needed
        ];

        // Calculate distance between two coordinates
        const distance = (
          lat1: number,
          lon1: number,
          lat2: number,
          lon2: number
        ) => {
          return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
        };

        // Find closest major city
        let closestCity = null;
        let minDistance = Number.MAX_VALUE;

        for (const city of majorCities) {
          const dist = distance(lat, lon, city.lat, city.lon);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = city;
          }
        }

        // If within radius of a major city, return it
        if (closestCity && minDistance <= closestCity.radius) {
          return closestCity.name;
        }

        // Otherwise return a generic name based on coordinates
        return `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
      };

      try {
        const city = await tryGeocodingServices();

        const locationData: LocationData = {
          latitude,
          longitude,
          timestamp: Date.now(),
          city,
        };

        await storage.set("weatherAppLocation", JSON.stringify(locationData));
        setCity(city);
        setLoading(false);
      } catch (error) {
        console.error("Error getting location name:", error);
        setError("Could not determine your city. Please try again later.");
        setLoading(false);
      }
    };

    const init = async () => {
      const hasSavedLocation = await tryUseSavedLocation();
      if (!hasSavedLocation) {
        try {
          const position = await requestGeolocation();
          const { latitude, longitude } = position.coords;
          await fetchCityFromCoordinates(latitude, longitude);
        } catch (error: any) {
          console.error("Geolocation error:", error);
          setLoading(false);
          setError(error.message);

          // Try to use saved location as fallback
          try {
            const savedLocation = await storage.get("weatherAppLocation");
            if (savedLocation) {
              const locationData = JSON.parse(savedLocation as string);
              setCity(locationData.city);
              setError(
                (prevError) => prevError + " Using last known location."
              );
            }
          } catch (e) {
            console.error("Error reading saved location:", e);
          }
        }
      }
    };

    init();
  }, []);

  return { city, loading, error };
}
