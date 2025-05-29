/**
 * Serwis API do komunikacji z backendem
 * 
 * Dostępne metody:
 * - getCurrentWeather(city): pobiera aktualną pogodę dla miasta
 * - getForecast(city): pobiera 5-dniową prognozę dla miasta
 * 
 * Jak używać:
 * import { weatherApi } from './services/api';
 * 
 * // Pobieranie aktualnej pogody
 * const weather = await weatherApi.getCurrentWeather('Warszawa');
 * 
 * // Pobieranie prognozy
 * const forecast = await weatherApi.getForecast('Warszawa');
 */

import axios from 'axios';

const API_BASE_URL = '/api';

export const weatherApi = {
  getCities: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cities`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch cities list');
    }
  },

  getCurrentWeather: async (city) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/${city}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch weather data');
    }
  },

  getForecast: async (city) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/forecast/${city}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch forecast data');
    }
  }
}; 