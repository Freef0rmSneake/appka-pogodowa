/**
 * Komponent prognozy pogody - wyświetla 5-dniową prognozę
 * 
 * Co robi:
 * - Pobiera prognozę pogody dla wybranego miasta
 * - Wyświetla prognozę w formie siatki kart
 * - Pokazuje temperaturę, wilgotność i opis dla każdego przedziału czasowego
 * 
 * Jak to działa:
 * 1. Otrzymuje nazwę miasta jako prop
 * 2. Automatycznie pobiera prognozę po zmianie miasta
 * 3. Wyświetla dane w formie kart pogodowych
 */

import { useState, useEffect } from 'react';
import { Typography, Box, Grid, CircularProgress, Alert } from '@mui/material';
import { weatherApi } from '../services/api';
import WeatherCard from './WeatherCard';

function Forecast({ city }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (city) {
      fetchForecast();
    }
  }, [city]);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherApi.getForecast(city);
      setForecast(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Prognoza 5-dniowa
      </Typography>

      {forecast && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {forecast.forecast.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <WeatherCard
                title={new Date(item.datetime).toLocaleDateString()}
                temperature={item.temperature}
                humidity={item.humidity}
                description={item.description}
                icon={item.icon}
                subtitle={new Date(item.datetime).toLocaleTimeString()}
                windSpeed={item.wind_speed}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Forecast; 