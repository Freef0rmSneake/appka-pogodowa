import axios from 'axios';
import { WeatherData, ForecastData, SearchResult, ApiError, WeatherCondition } from '../types/weather';


// Get weather ID from icon code
const getWeatherIdFromIcon = (icon?: string): number => {
  if (!icon) return 800; // Default to clear sky if no icon provided
  
  // Extract the first two characters of the icon code (e.g., '01' from '01d')
  const iconPrefix = icon.substring(0, 2);
  
  // Map the icon prefix to a weather ID
  const prefixToId: Record<string, number> = {
    '01': 800, // clear sky
    '02': 801, // few clouds
    '03': 802, // scattered clouds
    '04': 803, // broken clouds
    '09': 500, // shower rain
    '10': 501, // rain
    '11': 200, // thunderstorm
    '13': 600, // snow
    '50': 701, // mist/fog/haze
  };
  
  // Return the mapped ID or default to clear sky
  return prefixToId[iconPrefix] || 800;
};

// Get weather main condition from icon code
const getWeatherMainFromIcon = (icon?: string): string => {
  if (!icon) return 'Clear'; // Default to Clear if no icon provided
  
  // Extract the first two characters of the icon code (e.g., '01' from '01d')
  const iconPrefix = icon.substring(0, 2);
  
  // Map the icon prefix to a weather condition
  const prefixToMain: Record<string, string> = {
    '01': 'Clear',
    '02': 'Clouds',
    '03': 'Clouds',
    '04': 'Clouds',
    '09': 'Rain',
    '10': 'Rain',
    '11': 'Thunderstorm',
    '13': 'Snow',
    '50': 'Mist'
  };
  
  return prefixToMain[iconPrefix] || 'Clear';
};

const API_BASE_URL = '/api'; // This will be proxied to the backend server

// Helper function to handle API errors
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const apiError = error.response.data as ApiError;
      throw new Error(apiError.message || 'An error occurred while fetching weather data');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from the server. Please check your connection.');
    }
  }
  // Something happened in setting up the request that triggered an Error
  throw new Error('An error occurred while making the request');
};

/**
 * Fetches current weather data for a city
 * @param city City name to search for
 * @returns Promise with weather data
 */
export const getWeather = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/${city}`);
    console.log('[getWeather] Raw API response:', JSON.stringify(response.data, null, 2));
    console.log('API Response:', response.data); // Log the full API response
    // Transform the response to match our frontend types
    return {
      ...response.data,
      main: {
        temp: response.data.temperature,
        feels_like: response.data.feels_like,
        temp_min: response.data.temperature - 2, // Approximate min temp
        temp_max: response.data.temperature + 2, // Approximate max temp
        pressure: 1013, // Default pressure
        humidity: response.data.humidity,
      },
      weather: [{
        id: getWeatherIdFromIcon(response.data.icon),
        main: getWeatherMainFromIcon(response.data.icon),
        description: response.data.description,
        icon: response.data.icon,
      }],
      wind: {
        speed: response.data.wind_speed || 0,
        deg: 0,   // Default value if not provided
      },
      clouds: {
        all: 0,   // Default value
      },
      sys: {
        country: 'PL',
        sunrise: 0,
        sunset: 0,
      },
      visibility: 10000, // Default value
      dt: Math.floor(Date.now() / 1000), // Current timestamp
      timezone: 0,
      id: 0,
      name: response.data.city,
      cod: 200,
      coord: {
        lon: 0, // Default value
        lat: 0, // Default value
      },
      base: 'stations',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetches weather forecast for a city
 * @param city City name to get forecast for
 * @returns Promise with forecast data array
 */
export const getForecast = async (city: string): Promise<ForecastData[]> => {
  try {
    console.log('[getForecast] Fetching forecast for city:', city);
    const response = await axios.get<{forecast: Array<{
      datetime: string;
      temperature: number;
      feels_like: number;
      humidity: number;
      description: string;
      icon: string;
      wind_speed: number;
    }>}>(`${API_BASE_URL}/forecast/${city}`);
    
    console.log('[getForecast] Raw API response:', response.data);
    
    // Transform the response to match our frontend types
    const forecastData = response.data.forecast.map((item, index) => {
      console.log(`[getForecast] Processing item ${index}:`, item);
      
      // Map the icon code to a valid OpenWeather icon code if needed
      const iconCode = item.icon || '01d'; // Default to clear sky icon if not provided
      
      return {
        dt: Math.floor(new Date(item.datetime).getTime() / 1000) + (index * 86400), // Add a day for each item
        dt_txt: item.datetime,
        main: {
          temp: item.temperature,
          feels_like: item.feels_like,
          temp_min: item.temperature - 2, // Approximate min temp
          temp_max: item.temperature + 2, // Approximate max temp
          pressure: 1013, // Default pressure
          humidity: item.humidity,
          temp_kf: 0, // Default value
        },
        weather: [{
          id: getWeatherIdFromIcon(iconCode), // Map icon to weather ID
          main: getWeatherMainFromIcon(iconCode),
          description: item.description,
          icon: iconCode, // Use the icon code from the API
        }],
        wind: {
          speed: item.wind_speed || 0, // Default to 0 if not provided
          deg: 0, // Default value
        },
        clouds: {
          all: 0, // Default value
        },
        visibility: 10000, // Default value
        pop: 0, // Default value
        sys: {
          pod: item.datetime.includes('12:00:00') ? 'd' : 'n', // Set day/night based on time
        },
      };
    });
    
    console.log('[getForecast] Processed forecast data:', forecastData);
    return forecastData;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Gets list of available Polish cities
 * @returns Promise with list of cities
 */
export const getCities = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_BASE_URL}/cities`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
