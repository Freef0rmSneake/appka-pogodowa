Aplikacja Pogodowa

## Funkcjonalności

- Dane pogodowe w czasie rzeczywistym dla dowolnego miasta
- Responsywny design dla wszystkich urządzeń
- Aktualne informacje pogodowe zawierające:
  - Temperaturę
  - Temperaturę odczuwalną
  - Wilgotność
  - Opis pogody
  - Ikonę pogody
- Stany ładowania i obsługa błędów
- Wsparcie dla CORS (Cross-Origin Resource Sharing)

## Technologie

### Frontend
- React
- Vite
- Material-UI
- Axios
- Emotion

### Backend
- Flask
- Python-dotenv
- Requests
- Flask-CORS

## Wymagania

- Node.js
- Python
- Klucz API OpenWeatherMap

## Instalacja

1. Sklonuj repozytorium:
```bash
git clone <adres>
cd weather-app
```

2. Konfiguracja Backendu:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # W systemie Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Utwórz plik `.env` w katalogu backend:
```
OPENWEATHER_API_KEY=twój_klucz_api
```

4. Konfiguracja Frontendu:
```bash
cd frontend
npm install
```

## Uruchamianie Aplikacji

1. Uruchom serwer backend:
```bash
cd backend
python main.py
```

2. W nowym terminalu, uruchom serwer deweloperski frontendu:
```bash
cd frontend
npm run dev
```

3. Otwórz przeglądarkę i przejdź pod adres `http://localhost:5173`

## Endpointy API

### Dane Pogodowe
- `GET /api/weather/<miasto>`
  - Zwraca aktualne dane pogodowe dla podanego miasta
  - Odpowiedź zawiera temperaturę, wilgotność, opis pogody i ikonę

## Zmienne Środowiskowe

### Backend (.env)
- `OPENWEATHER_API_KEY`: Twój klucz API OpenWeatherMap

