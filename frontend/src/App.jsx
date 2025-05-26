import { useState } from 'react'
import { 
  Container, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import axios from 'axios'

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
      const response = await axios.get(`/api/weather/${city}`)
      setWeather(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
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
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {weather.city}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {weather.temperature}°C
            </Typography>
            <Typography variant="body1">
              Feels like: {weather.feels_like}°C
            </Typography>
            <Typography variant="body1">
              Humidity: {weather.humidity}%
            </Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {weather.description}
            </Typography>
            {weather.icon && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={`http://openweathermap.org/img/w/${weather.icon}.png`}
                  alt={weather.description}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default App
