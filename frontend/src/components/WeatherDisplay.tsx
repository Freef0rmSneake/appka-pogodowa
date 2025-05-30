import React from 'react';
import styled from 'styled-components';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiDayCloudy
} from 'react-icons/wi';
import { WeatherData } from '../types/weather';

const WeatherContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Location = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const DateText = styled.p`
  color: #7f8c8d;
  margin-bottom: 1.5rem;
`;

const WeatherMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const WeatherRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  text-align: center;
`;

const Temperature = styled.div`
  font-size: 4rem;
  font-weight: 300;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WeatherIcon = styled.div`
  font-size: 5rem;
  color: #f39c12;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const WeatherDescription = styled.p`
  font-size: 1.25rem;
  color: #7f8c8d;
  text-transform: capitalize;
  margin-top: 0.5rem;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const DetailLabel = styled.p`
  color: #7f8c8d;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  color: #2c3e50;
`;

// Helper function to get weather icon based on condition
const getWeatherIcon = (weatherId: number) => {
  if (weatherId >= 200 && weatherId < 300)
    return <WiThunderstorm style={{ fontSize: '5rem', color: '#6a5acd' }} />;
  if (weatherId >= 300 && weatherId < 400)
    return <WiRain style={{ fontSize: '5rem', color: '#4682b4' }} />;
  if ((weatherId >= 500 && weatherId < 600) || (weatherId >= 520 && weatherId < 532))
    return <WiRain style={{ fontSize: '5rem', color: '#4682b4' }} />;
  if ((weatherId === 511) || (weatherId >= 600 && weatherId < 700))
    return <WiSnow style={{ fontSize: '5rem', color: '#00bfff' }} />;
  if (weatherId >= 700 && weatherId < 800)
    return <WiFog style={{ fontSize: '5rem', color: '#888888' }} />;
  if (weatherId === 800)
    return <WiDaySunny style={{ fontSize: '5rem', color: '#ffd700' }} />;
  if (weatherId === 801)
    return <WiDayCloudy style={{ fontSize: '5rem', color: '#87ceeb' }} />;
  if (weatherId === 802)
    return <WiCloudy style={{ fontSize: '5rem', color: '#a9a9a9' }} />;
  if (weatherId === 803 || weatherId === 804)
    return <WiCloudy style={{ fontSize: '5rem', color: '#778899' }} />;
  return <WiDaySunny style={{ fontSize: '5rem', color: '#ffd700' }} />;
};

// Tłumaczenie nazw miast na język polski
const translateCityName = (cityName: string): string => {
  const cityTranslations: Record<string, string> = {
    'Warsaw': 'Warszawa',
    'Cracow': 'Kraków',
    'Lodz': 'Łódź',
    'Wroclaw': 'Wrocław',
    'Poznan': 'Poznań',
    'Gdansk': 'Gdańsk',
    'Szczecin': 'Szczecin',
    'Bydgoszcz': 'Bydgoszcz',
    'Lublin': 'Lublin',
    'Katowice': 'Katowice',
  };
  
  return cityTranslations[cityName] || cityName;
};

// Format date to a readable string
const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Tłumaczenie opisów pogody na język polski
const translateWeatherDescription = (description: string): string => {
  const translations: Record<string, string> = {
    'clear sky': 'bezchmurnie',
    'few clouds': 'małe zachmurzenie',
    'scattered clouds': 'rozproszone chmury',
    'broken clouds': 'zachmurzenie umiarkowane',
    'overcast clouds': 'zachmurzenie całkowite',
    'shower rain': 'przelotne opady deszczu',
    'rain': 'deszcz',
    'light rain': 'lekki deszcz',
    'moderate rain': 'umiarkowany deszcz',
    'thunderstorm': 'burza',
    'snow': 'śnieg',
    'mist': 'mgła',
    'fog': 'mgła',
    'haze': 'zamglenie',
    'dust': 'zapylenie',
    'sand': 'piasek',
    'ash': 'popiół',
    'squall': 'szkwał',
    'tornado': 'tornado'
  };
  
  // Znajdź tłumaczenie lub zwróć oryginalny opis z pierwszą wielką literą
  return translations[description.toLowerCase()] || 
         (description.charAt(0).toUpperCase() + description.slice(1));
};

interface WeatherDisplayProps {
  weather: WeatherData;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  const { name, sys, dt, weather: weatherInfo, main, wind, visibility } = weather;
  const weatherCondition = weatherInfo[0];
  // Oblicz lokalną godzinę miasta na podstawie dt (UTC) i przesunięcia weather.timezone (sekundy)
  const localTime = new Date((dt + weather.timezone) * 1000);
  const localTimeString = localTime.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <WeatherContainer>
      <Location>
        {translateCityName(name)}, {sys.country}
      </Location>
      <DateText>{formatDate(dt)} • Godzina lokalna: {localTimeString}</DateText>
      
      <WeatherMain>
        {/* Centered temperature and weather info */}
        <WeatherRow>
          <WeatherInfo>
            <WeatherIcon>
              {getWeatherIcon(weatherCondition.id)}
            </WeatherIcon>
            <Temperature>
              {Math.round(main.temp)}°C
            </Temperature>
            <WeatherDescription>
              {translateWeatherDescription(weatherCondition.description)}
            </WeatherDescription>
          </WeatherInfo>
        </WeatherRow>

        {/* Second row - additional weather details */}
        <WeatherRow>
          <WeatherDetails>
            <DetailItem>
              <DetailLabel>Min / Max</DetailLabel>
              <DetailValue>
                {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Odczuwalna</DetailLabel>
              <DetailValue>{Math.round(main.feels_like)}°C</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Wilgotność</DetailLabel>
              <DetailValue>{main.humidity}%</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Ciśnienie</DetailLabel>
              <DetailValue>{main.pressure} hPa</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Wiatr</DetailLabel>
              <DetailValue>{Math.round(wind.speed * 3.6)} km/h</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Widoczność</DetailLabel>
              <DetailValue>{(visibility / 1000).toFixed(1)} km</DetailValue>
            </DetailItem>
          </WeatherDetails>
        </WeatherRow>
      </WeatherMain>
    </WeatherContainer>
  );
};
