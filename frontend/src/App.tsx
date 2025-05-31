import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchBar } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import { Forecast } from './components/Forecast';
import { getWeather, getForecast, getCities } from './services/weatherService';
import { WeatherData, ForecastData } from './types/weather';
import { WiDaySunny } from 'react-icons/wi';
import { SearchHistory } from './components/SearchHistory';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1.5rem;
  border-left: 4px solid #c62828;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  h2 {
    color: #2c3e50;
    margin: 1rem 0 0.5rem;
  }
  
  p {
    color: #7f8c8d;
    font-size: 1.1rem;
  }
  
  svg {
    color: #4a90e2;
  }
`;

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCity = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const availableCities = await getCities();
      const normalizedCityName = cityName.toLowerCase();
      const matchingCity = availableCities.find(
        city => city.toLowerCase() === normalizedCityName
      );
      
      if (!matchingCity) {
        throw new Error(`City "${cityName}" not found. Please try another city from the list.`);
      }
      
      const weatherData = await getWeather(matchingCity);
      setWeather(weatherData);
      
      const forecastData = await getForecast(matchingCity);
      setForecast(forecastData);
      
      setCity('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Title>Prognoza pogody</Title>
      <Content>
        <SearchBar 
          city={city}
          setCity={setCity}
          onSearch={searchCity}
          loading={loading}
        />
        <SearchHistory onSelect={searchCity} />

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {weather ? (
          <>
            <WeatherDisplay weather={weather} />
            {forecast.length > 0 && <Forecast forecastList={forecast} />}
          </>
        ) : (
          <WelcomeMessage>
            <WiDaySunny size={64} />
            <h2>Witamy w aplikacji Pogoda</h2>
            <p>Wyszukaj polskie miasto, aby zobaczyć aktualną pogodę i prognozę</p>
          </WelcomeMessage>
        )}
      </Content>
    </AppContainer>
  );
};

export default App;
