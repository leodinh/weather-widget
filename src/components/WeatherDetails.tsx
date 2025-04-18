import React from "react";
import { useTheme } from "./theme-provider";
import { WeatherData } from "@/type";

interface WeatherDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeatherData;
} 
   
const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-[5px] flex items-center justify-center z-50 transition-colors duration-300"
      style={{
        backgroundColor: theme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(128,128,128,0.5)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`backdrop-blur-xl p-8 rounded-2xl w-96 relative border animate-fadeIn transition-colors duration-300 ${
          theme === "dark"
            ? "bg-black/10 border-white/10 text-white"
            : "bg-white/10 border-black/10 text-black"
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          <DetailCard
            title="Temperature"
            value={`${Math.floor(data.main?.temp)}°C`}
            subtitle={`Feels like ${Math.floor(data.main?.feels_like)}°C`}
            extraInfo={
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>H: {Math.floor(data.main?.temp_max)}°C</span>
                <span>L: {Math.floor(data.main?.temp_min)}°C</span>
              </div>
            }
          />
          <DetailCard
            title="Humidity"
            value={`${data.main?.humidity}%`}
          />
          <DetailCard
            title="Wind"
            value={`${data.wind?.speed} m/s`}
            subtitle={`Direction: ${data.wind?.deg}°`}
          />
          <DetailCard title="Pressure" value={`${data.main?.pressure} hPa`} />
          {data.rain && (
            <DetailCard
              title="Rain"
              value={`${data.rain?.["1h"] || 0} mm`}
              subtitle="Last hour"
            />
          )}
          {data.snow && (
            <DetailCard
              title="Snow"
              value={`${data.snow?.["1h"] || 0} mm`}
              subtitle="Last hour"
            />
          )}
          <DetailCard
            title="Visibility"
            value={`${(data.visibility / 1000).toFixed(1)} km`}
          />
          <DetailCard title="Clouds" value={`${data.clouds?.all}%`} />
        </div>
      </div>
    </div>
  );
};

interface DetailCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  extraInfo?: React.ReactNode;
}

const DetailCard: React.FC<DetailCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  extraInfo,
}) => (
  <div className="bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm text-gray-300">{title}</h3>
      {icon}
    </div>
    <p className="text-xl font-semibold text-white">{value}</p>
    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    {extraInfo}
  </div>
);

export default WeatherDetails;
