/**
 * Komponent karty pogodowej - wyświetla informacje o pogodzie
 * 
 * Props:
 * - title: tytuł karty (np. nazwa miasta)
 * - subtitle: podtytuł karty (np. data)
 * - temperature: temperatura w stopniach Celsjusza
 * - feelsLike: odczuwalna temperatura
 * - humidity: wilgotność w procentach
 * - description: opis pogody
 * - icon: kod ikony pogody
 * - windSpeed: prędkość wiatru
 * 
 * Używany do wyświetlania:
 * - Aktualnej pogody
 * - Prognozy pogody
 */

import { Card, CardContent, Typography, Box } from '@mui/material';

function WeatherCard({ title, subtitle, temperature, feelsLike, humidity, description, icon, windSpeed }) {
  return (
    <Card>
      <CardContent>
        {title && (
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {subtitle}
          </Typography>
        )}
        <Typography variant="h6" color="textSecondary">
          {temperature}°C
        </Typography>
        {feelsLike && (
          <Typography variant="body1">
            Odczuwalna: {feelsLike}°C
          </Typography>
        )}
        {humidity && (
          <Typography variant="body1">
            Wilgotność: {humidity}%
          </Typography>
        )}
        {windSpeed && (
          <Typography variant="body1">
            Wiatr: {windSpeed} m/s
          </Typography>
        )}
        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
          {description}
        </Typography>
        {icon && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <img
              src={`http://openweathermap.org/img/w/${icon}.png`}
              alt={description}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default WeatherCard; 