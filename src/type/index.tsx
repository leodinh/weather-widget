export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  rain?: {
    "1h": number;
  };
  snow?: {
    "1h": number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  timezone: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
}
