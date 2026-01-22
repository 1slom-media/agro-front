# Weather Widget Documentation

## Overview
The weather widget displays real-time weather information for cities across Uzbekistan. It's integrated into the header and provides users with current temperature and weather conditions.

## Features
- **City Selector**: Dropdown menu with all major cities in Uzbekistan
- **Multilingual Support**: City names displayed in Uzbek, Russian, and English
- **Real-time Weather**: Shows current temperature and weather condition
- **Weather Icons**: Visual representation of weather conditions (sunny, cloudy, rainy, snowy, windy)
- **Responsive Design**: Works on both desktop and mobile devices

## Supported Cities
- Tashkent (Toshkent / Ташкент)
- Samarkand (Samarqand / Самарканд)
- Bukhara (Buxoro / Бухара)
- Andijan (Andijon / Андижан)
- Namangan (Namangan / Наманган)
- Fergana (Farg'ona / Фергана)
- Nukus (Nukus / Нукус)
- Urgench (Urganch / Ургенч)
- Karshi (Qarshi / Карши)
- Termez (Termiz / Термез)
- Jizzakh (Jizzax / Джизак)
- Gulistan (Guliston / Гулистан)

## Setup

### Using Real Weather Data (OpenWeatherMap API)

1. **Get API Key**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

2. **Configure Environment Variable**:
   - Copy `.env.example` to `.env.local`
   - Add your API key:
     ```
     NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
     ```

3. **Enable Real API**:
   - Open `components/weather-widget.tsx`
   - Change `useRealAPI` from `false` to `true` (line 51)

### Using Simulated Data (Default)
By default, the widget uses simulated weather data. No configuration needed.

## Component Usage

```tsx
import { WeatherWidget } from "@/components/weather-widget"

// In your component
<WeatherWidget />
```

## Integration
The weather widget is already integrated into:
- Desktop header (between logo and action buttons)
- Mobile header (before language selector)

## Customization

### Adding More Cities
Edit `uzbekistanCities` array in `components/weather-widget.tsx`:

```tsx
const uzbekistanCities = [
  { name: "CityName", nameUz: "Uzbek Name", nameRu: "Russian Name" },
  // Add more cities...
]
```

### Styling
The widget uses Tailwind CSS classes and can be customized by modifying the component's className props.

## API Information

### OpenWeatherMap API
- **Endpoint**: `https://api.openweathermap.org/data/2.5/weather`
- **Parameters**:
  - `q`: City name and country code (e.g., "Tashkent,UZ")
  - `units`: "metric" for Celsius
  - `appid`: Your API key
- **Free Tier Limits**: 60 calls/minute, 1,000,000 calls/month

## Troubleshooting

### Weather not updating
- Check if API key is correctly set in `.env.local`
- Verify `useRealAPI` is set to `true`
- Check browser console for errors
- Ensure you haven't exceeded API rate limits

### City not found
- Verify city name spelling matches OpenWeatherMap database
- Try using English city names
- Check if city is available in OpenWeatherMap

## Future Enhancements
- [ ] Add weather forecast (3-day, 7-day)
- [ ] Display additional weather info (humidity, wind speed)
- [ ] Add weather alerts for agricultural conditions
- [ ] Cache weather data to reduce API calls
- [ ] Add weather-based recommendations for farming

