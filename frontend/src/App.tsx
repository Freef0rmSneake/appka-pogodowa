import React, { useState } from 'react';
import styled from 'styled-components';
import { SearchBar } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import { Forecast } from './components/Forecast';
import { getWeather, getForecast, getCities } from './services/weatherService';
import { WeatherData, ForecastData } from './types/weather';
import { WiDaySunny } from 'react-icons/wi';

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
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [alert, setAlert] = useState<string | null>(null);
  const [allCities, setAllCities] = useState<string[]>([]);

  React.useEffect(() => {
    const fetchCities = async () => {
      try {
        const cities = await getCities();
        setAllCities(cities);
      } catch (e) {
        setAllCities([]);
      }
    };
    fetchCities();
  }, []);

  const handleCityListSelect = (cityName: string) => {
    setCity(cityName);
    searchCity(cityName);
  };


  const searchCity = async (cityName: string) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);
    setAlert(null);
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
      // --- HISTORIA ---
      setHistory(prev => [matchingCity, ...prev.filter(c => c !== matchingCity)].slice(0, 10));
      // --- ALERTY ---
      const temp = weatherData?.temp ?? weatherData?.temperature;
      const desc = (weatherData?.description ?? '').toLowerCase();
      if (typeof temp === 'number' && (temp > 30 || temp < -10)) {
        setAlert('Uwaga! Ekstremalna temperatura!');
      } else if (desc.includes('burza') || desc.includes('storm') || desc.includes('wiatr') || desc.includes('wind')) {
        setAlert('Uwaga! Ekstremalne warunki pogodowe!');
      } else {
        setAlert(null);
      }
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

  // Pozwól na szybkie ponowne wyszukiwanie z historii
  const handleHistorySearch = (cityName: string) => {
    searchCity(cityName);
  };


  return (
    <AppContainer>
      <Title style={{ cursor: 'pointer' }} onClick={() => {
        setCity('');
        setWeather(null);
        setError(null);
      }}>Prognoza pogody</Title>
      <Content>

        <SearchBar 
          city={city}
          setCity={setCity}
          onSearch={searchCity}
          loading={loading}
          searchHistory={history}
        />
        {/* Lista miast tylko na stronie startowej */}
         {weather === null && (
           <>
             {allCities.length > 0 && (
               <div style={{ marginBottom: '1rem' }}>
                 <h3 style={{ textAlign: 'center' }}>Lista polskich miast:</h3>
                 <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 8 }}>
                   <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                     {allCities.slice(0, 30).map(cityName => (
                       <li key={cityName}>
                         <button style={{ border: '1px solid #e0e0e0', borderRadius: '20px', padding: '0.2rem 1rem', background: '#fafafa', cursor: 'pointer' }} onClick={() => handleCityListSelect(cityName)}>{cityName}</button>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             )}
           </>
         )}

        
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
        {/* ALERTY */}
        {alert && (
          <ErrorMessage style={{ backgroundColor: '#fff3cd', color: '#856404', borderLeft: '4px solid #ffe066' }}>{alert}</ErrorMessage>
        )}
        {/* HISTORIA */}
        {history.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <h3>Historia wyszukiwań:</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {history.map((h, idx) => (
                <li key={h+idx}>
                  <button style={{ border: '1px solid #e0e0e0', borderRadius: '20px', padding: '0.2rem 1rem', background: '#fafafa', cursor: 'pointer' }} onClick={() => handleHistorySearch(h)}>{h}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Content>
    </AppContainer>
  );
};

export default App;
