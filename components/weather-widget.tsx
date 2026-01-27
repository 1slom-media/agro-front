"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  MapPin,
  ChevronDown,
} from "lucide-react";

interface WeatherData {
  temp: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "windy";
  city: string;
}

const uzbekistanCities = [
  { name: "Tashkent", nameUz: "Toshkent", nameRu: "Ташкент" },
  { name: "Samarkand", nameUz: "Samarqand", nameRu: "Самарканд" },
  { name: "Bukhara", nameUz: "Buxoro", nameRu: "Бухара" },
  { name: "Andijan", nameUz: "Andijon", nameRu: "Андижан" },
  { name: "Namangan", nameUz: "Namangan", nameRu: "Наманган" },
  { name: "Fergana", nameUz: "Farg'ona", nameRu: "Фергана" },
  { name: "Nukus", nameUz: "Nukus", nameRu: "Нукус" },
  { name: "Urgench", nameUz: "Urganch", nameRu: "Ургенч" },
  { name: "Karshi", nameUz: "Qarshi", nameRu: "Карши" },
  { name: "Termez", nameUz: "Termiz", nameRu: "Термез" },
  { name: "Jizzakh", nameUz: "Jizzax", nameRu: "Джизак" },
  { name: "Gulistan", nameUz: "Guliston", nameRu: "Гулистан" },
];

export function WeatherWidget() {
  const { locale } = useI18n();
  const [selectedCity, setSelectedCity] = useState(uzbekistanCities[0]);
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: "sunny",
    city: "Tashkent",
  });
  const [loading, setLoading] = useState(false);

  // Fetch weather data (using OpenWeatherMap API or fallback to simulated data)
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);

      try {
        // Try to fetch real weather data
        // Note: In production, store API key in environment variables
        // For now, we'll use simulated data as a fallback
        const useRealAPI = true; // Set to true when you have an API key
 
        if (useRealAPI) {
          const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity.name},UZ&units=metric&appid=${API_KEY}`
          );
          if (response.ok) {
            const data = await response.json();
            const weatherMain = data.weather[0].main.toLowerCase();
            let condition: WeatherData["condition"] = "sunny";

            if (weatherMain.includes("cloud")) condition = "cloudy";
            else if (weatherMain.includes("rain")) condition = "rainy";
            else if (weatherMain.includes("snow")) condition = "snowy";
            else if (weatherMain.includes("wind")) condition = "windy";

            setWeather({
              temp: Math.round(data.main.temp),
              condition,
              city: selectedCity.name,
            });
          } else {
            throw new Error("API request failed");
          }
        } else {
          // Fallback: Simulate weather data
          const conditions: WeatherData["condition"][] = [
            "sunny",
            "cloudy",
            "rainy",
            "snowy",
            "windy",
          ];
          const randomCondition =
            conditions[Math.floor(Math.random() * conditions.length)];
          const randomTemp = Math.floor(Math.random() * 30) - 5; // -5 to 25°C

          setWeather({
            temp: randomTemp,
            condition: randomCondition,
            city: selectedCity.name,
          });
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
        // Fallback to simulated data on error
        const conditions: WeatherData["condition"][] = [
          "sunny",
          "cloudy",
          "rainy",
          "snowy",
          "windy",
        ];
        const randomCondition =
          conditions[Math.floor(Math.random() * conditions.length)];
        const randomTemp = Math.floor(Math.random() * 30) - 5;

        setWeather({
          temp: randomTemp,
          condition: randomCondition,
          city: selectedCity.name,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  const getWeatherIcon = (condition: WeatherData["condition"]) => {
    const iconClass = "h-5 w-5";
    switch (condition) {
      case "sunny":
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case "cloudy":
        return <Cloud className={`${iconClass} text-gray-400`} />;
      case "rainy":
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      case "snowy":
        return <CloudSnow className={`${iconClass} text-blue-300`} />;
      case "windy":
        return <Wind className={`${iconClass} text-gray-500`} />;
      default:
        return <Sun className={`${iconClass} text-yellow-500`} />;
    }
  };

  const getCityName = (city: (typeof uzbekistanCities)[0]) => {
    if (locale === "uz") return city.nameUz;
    if (locale === "ru") return city.nameRu;
    return city.name;
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="hidden md:inline text-sm font-medium">
              {getCityName(selectedCity)}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 max-h-80 overflow-y-auto"
        >
          {uzbekistanCities.map((city) => (
            <DropdownMenuItem
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className="cursor-pointer"
            >
              {getCityName(city)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg">
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          getWeatherIcon(weather.condition)
        )}
        <span className="text-sm font-semibold">
          {weather.temp > 0 ? "+" : ""}
          {weather.temp}°C
        </span>
      </div>
    </div>
  );
}
