# Aplikacja Pogodowa

Prosta aplikacja pogodowa wyświetlająca aktualną pogodę i prognozę dla polskich miast.

## Struktura projektu

```
apkapog/
├── frontend/          # Aplikacja React (frontend)
└── backend/           # Aplikacja Flask (backend)
```

## Wymagania wstępne

- Node.js (v14 lub nowszy)
- Python 3.8+
- npm lub yarn
- pip (menedżer pakietów Pythona)

## Konfiguracja backendu

1. Przejdź do katalogu backend:
   ```bash
   cd backend/appka-pogodowa-backend
   ```

2. Zainstaluj wymagane pakiety Pythona:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Utwórz plik `.env` w katalogu `backend/appka-pogodowa-backend` i dodaj swój klucz API OpenWeather:
   ```
   OPENWEATHER_API_KEY=twoj_klucz_api_openweather
   ```

4. Uruchom serwer backendowy:
   ```bash
   cd backend
   python -m flask run
   ```

   Serwer powinien być dostępny pod adresem `http://localhost:5000`

## Konfiguracja frontendu

1. Przejdź do katalogu frontend:
   ```bash
   cd frontend
   ```

2. Zainstaluj zależności:
   ```bash
   npm install
   # lub
   yarn install
   ```

3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   # lub
   yarn dev
   ```

   Aplikacja będzie dostępna pod adresem `http://localhost:5173`

## Dostępne miasta

Aplikacja obsługuje następujące polskie miasta:
- Warszawa
- Kraków
- Łódź
- Wrocław
- Poznań
- Gdańsk
- Szczecin
- Bydgoszcz
- Lublin
- Katowice

## Użyte technologie

### Frontend
- React 18
- TypeScript
- Styled Components
- Vite
- React Icons

### Backend
- Python 3.8+
- Flask
- python-dotenv
- requests
- flask-cors

## Licencja

MIT
