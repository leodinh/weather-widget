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
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.hamlet ||
          data.address.county ||
          "Unknown location";

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
