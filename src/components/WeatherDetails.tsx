import React from "react";
import Humidity from "../assets/humidity";

interface WeatherDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  // city: string;
  // currentTime: string;
  // isNight: boolean;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  isOpen,
  onClose,
  data,
  // city,
  // currentTime,
  // isNight,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-[5px] flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl w-96 relative border border-white/10 animate-fadeIn">
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-white">{city}</h2>
          <p className="text-lg text-gray-200">{currentTime}</p>
        </div> */}

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
            icon={<Humidity className="w-5 fill-(--text-color)" />}
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
