import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

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
      const response = await axios.get(`/api/forecast/${city}`);
      setForecast(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch forecast data');
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
        5-Day Weather Forecast
      </Typography>

      {forecast && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {forecast.forecast.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {new Date(item.datetime).toLocaleDateString()}
                  </Typography>
                  <Typography variant="subtitle1">
                    {new Date(item.datetime).toLocaleTimeString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <img
                      src={`http://openweathermap.org/img/w/${item.icon}.png`}
                      alt={item.description}
                    />
                    <Typography variant="h6">
                      {item.temperature}°C
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {item.description}
                  </Typography>
                  <Typography variant="body2">
                    Humidity: {item.humidity}%
                  </Typography>
                  <Typography variant="body2">
                    Wind: {item.wind_speed} m/s
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Forecast; 