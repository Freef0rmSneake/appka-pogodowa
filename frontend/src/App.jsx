/**
 * Główny komponent aplikacji pogodowej
 * 
 * Co robi ten plik:
 * - Wyświetla formularz wyszukiwania miasta
 * - Pokazuje aktualną pogodę dla wybranego miasta
 * - Zarządza stanem ładowania i błędów
 * - Wyświetla prognozę pogody
 * 
 * Jak to działa:
 * 1. Użytkownik wpisuje nazwę miasta
 * 2. Po wyszukaniu pokazuje się aktualna pogoda
 * 3. Pod spodem wyświetla się 5-dniowa prognoza
 */

import { useState } from 'react'
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import { weatherApi } from './services/api'
import Forecast from './components/Forecast'
import WeatherCard from './components/WeatherCard'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim()) return

    setLoading(true)
    setError(null)
    
    try {
      const data = await weatherApi.getCurrentWeather(city)
      setWeather(data)
    } catch (err) {
      setError(err.message)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Weather App
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={loading || !city.trim()}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {weather && (
        <Box sx={{ mb: 4 }}>
          <WeatherCard
            title={weather.city}
            temperature={weather.temperature}
            feelsLike={weather.feels_like}
            humidity={weather.humidity}
            description={weather.description}
            icon={weather.icon}
          />
        </Box>
      )}

      {weather && <Forecast city={city} />}
    </Container>
  )
}

export default App
