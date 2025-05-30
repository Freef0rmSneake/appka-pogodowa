// Weather condition information
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

// Main weather data
export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

// Wind information
export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

// Cloudiness information
export interface Clouds {
  all: number;
}

// System information
export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

// Main weather data response
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Forecast item
export interface ForecastItem {
  dt: number;
  main: MainWeatherData & {
    temp_kf: number;
  };
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

// Forecast data response
export interface ForecastData extends Omit<ForecastItem, 'weather' | 'main'> {
  weather: WeatherCondition[];
  main: MainWeatherData;
  dt: number;
  dt_txt: string;
}

// API Error response
export interface ApiError {
  cod: string;
  message: string;
}

// Search result
export interface SearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
