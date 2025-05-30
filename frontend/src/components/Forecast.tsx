import React from 'react';
import styled from 'styled-components';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudyHigh } from 'react-icons/wi';
import { ForecastData } from '../types/weather';

const ForecastContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ForecastTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  text-align: center;
`;

const ForecastList = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 3px;
    }
  }
`;

const ForecastItem = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  min-width: 140px;
  flex: 1;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    min-width: 120px;
    flex: 0 0 auto;
  }
`;

const Day = styled.p`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const Time = styled.p`
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-bottom: 0.5rem;
`;

const ForecastIcon = styled.div`
  font-size: 2.5rem;
  margin: 0.5rem 0;
  color: #4a90e2;
`;

const Temp = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  color: #2c3e50;
  margin: 0.5rem 0;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #7f8c8d;
  text-transform: capitalize;
  margin-top: 0.5rem;
`;

const ForecastDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
`;

const Detail = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Helper function to get weather icon based on condition ID
const getWeatherIcon = (weatherId: number): JSX.Element => {
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return <WiThunderstorm style={{ fontSize: '2.5rem', color: '#6a5acd' }} />;
  } 
  // Drizzle
  else if (weatherId >= 300 && weatherId < 400) {
    return <WiRain style={{ fontSize: '2.5rem', color: '#4682b4' }} />;
  } 
  // Rain
  else if (weatherId >= 500 && weatherId < 600) {
    if (weatherId === 500) {
      return <WiRain style={{ fontSize: '2.5rem', color: '#4682b4' }} />; // Light rain
    } else if (weatherId === 501 || weatherId === 502) {
      return <WiRain style={{ fontSize: '2.5rem', color: '#4169e1' }} />; // Moderate/heavy rain
    } else {
      return <WiRain style={{ fontSize: '2.5rem', color: '#0000cd' }} />; // Very heavy rain
    }
  } 
  // Snow
  else if (weatherId >= 600 && weatherId < 700) {
    return <WiSnow style={{ fontSize: '2.5rem', color: '#e6e6fa' }} />;
  } 
  // Atmosphere (mist, fog, etc.)
  else if (weatherId >= 700 && weatherId < 800) {
    return <WiFog style={{ fontSize: '2.5rem', color: '#d3d3d3' }} />;
  } 
  // Clear
  else if (weatherId === 800) {
    return <WiDaySunny style={{ fontSize: '2.5rem', color: '#ffd700' }} />;
  } 
  // Clouds
  else if (weatherId === 801) {
    return <WiDayCloudyHigh style={{ fontSize: '2.5rem', color: '#87ceeb' }} />; // Few clouds
  } 
  else if (weatherId === 802) {
    return <WiCloudy style={{ fontSize: '2.5rem', color: '#a9a9a9' }} />; // Scattered clouds
  }
  else if (weatherId === 803 || weatherId === 804) {
    return <WiCloudy style={{ fontSize: '2.5rem', color: '#778899' }} />; // Broken/overcast clouds
  }
  
  // Default
  return <WiDaySunny style={{ fontSize: '2.5rem', color: '#ffd700' }} />;
};

// Tłumaczenie opisów pogody na język polski
const translateWeatherDescription = (description?: string): string => {
  if (!description) return ''; // Return empty string if description is undefined or null
  const translations: Record<string, string> = {
    'clear sky': 'Bezchmurnie',
    'few clouds': 'Małe zachmurzenie',
    'scattered clouds': 'Rozproszone chmury',
    'broken clouds': 'Zachmurzenie umiarkowane',
    'overcast clouds': 'Zachmurzenie całkowite',
    'shower rain': 'Przelotne opady deszczu',
    'rain': 'Deszcz',
    'light rain': 'Lekki deszcz',
    'moderate rain': 'Umiarkowany deszcz',
    'thunderstorm': 'Burza',
    'snow': 'Śnieg',
    'mist': 'Mgła',
    'fog': 'Mgła',
    'haze': 'Zamglenie',
    'dust': 'Zapylenie',
    'sand': 'Piasek',
    'ash': 'Popiół',
    'squall': 'Szkwał',
    'tornado': 'Tornado'
  };
  
  // Znajdź tłumaczenie lub zwróć oryginalny opis z pierwszą wielką literą
  const lowerDescription = description.toLowerCase();
  return translations[lowerDescription] || 
         (description.charAt(0).toUpperCase() + description.slice(1));
};

// Format date to day of week and time
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString('pl-PL', { weekday: 'long' });
  const time = date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return { day, time };
};

interface ForecastProps {
  forecastList: ForecastData[];
}

export const Forecast: React.FC<ForecastProps> = ({ forecastList }) => {
  if (!forecastList || forecastList.length === 0) return null;

  // Group forecast by day
  const dailyForecast = forecastList.reduce<Record<string, ForecastData[]>>((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Get one forecast per day (at 12:00 if available, otherwise first available)
  const oneForecastPerDay = Object.values(dailyForecast).map(dayForecasts => {
    const middayForecast = dayForecasts.find(f => f.dt_txt.includes('12:00:00'));
    return middayForecast || dayForecasts[0];
  }).slice(0, 5); // Show only next 5 days

  return (
    <ForecastContainer>
      <ForecastTitle>Prognoza pogody</ForecastTitle>
      <ForecastList>
        {oneForecastPerDay.map((forecast, idx) => {
  console.log('Forecast - forecast.weather:', forecast.weather);
  console.log('Forecast - forecast.weather[0].id:', forecast.weather?.[0]?.id);
          const { day, time } = formatDateTime(forecast.dt_txt);
          const weatherCondition = forecast.weather[0];
          
          return (
            <ForecastItem key={forecast.dt}>
              <Day>{day}</Day>
              <Time>{time}</Time>
              <ForecastIcon>{getWeatherIcon(weatherCondition.id)}</ForecastIcon>
              <Temp>{Math.round(forecast.main.temp)}°C</Temp>
              <Description>{translateWeatherDescription(weatherCondition.description)}</Description>
              <ForecastDetails>
                <Detail>
                  <span>↓{Math.round(forecast.main.temp_min)}°</span>
                </Detail>
                <Detail>
                  <span>↑{Math.round(forecast.main.temp_max)}°</span>
                </Detail>
              </ForecastDetails>
              <ForecastDetails>
                <Detail>
                  <span>💧 {forecast.main.humidity}%</span>
                </Detail>
                <Detail>
                  <span>🌬️ {Math.round(forecast.wind.speed * 3.6)}km/h</span>
                </Detail>
              </ForecastDetails>
            </ForecastItem>
          );
        })}
      </ForecastList>
    </ForecastContainer>
  );
};
