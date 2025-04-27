# Projekt Aplikacji Pogodowej (Zaliczenie)


## Technologie Główne

* **Frontend:** React (Vite)
* **Backend:** Python (Flask)
* **API Pogodowe:** OpenWeatherMap
* **Baza Danych/reszta:** Do ustalenia

## Struktura Projektu

* `/frontend`: Kod aplikacji React
* `/backend`: Kod aplikacji Flask

## Setup

1.  **Sklonuj repozytorium:**
    ```
    git clone [link]
    cd weather-app-project
    ```

2.  **Skonfiguruj Frontend:**
    ```
    cd frontend
    npm install
    cd ..
    ```

3.  **Skonfiguruj Backend:**
    ```
    cd backend
    python -m venv venv  # Utwórz wirtualne środowisko
    # Aktywuj środowisko (zobacz komendy poniżej)
    # Windows (PowerShell):  venv\Scripts\Activate.ps1
    # Linux:   source venv/bin/activate
    pip install -r requirements.txt # Zainstaluj zależności
    cd ..
    ```

## Uruchamianie Aplikacji Lokalnie

1.  **Uruchom Backend:**
    ```
    cd backend
    # Aktywuj venv, jeśli nie jest aktywne
    flask run
    ```
    Backend będzie działał na `http://localhost:5000`.

2.  **Uruchom Frontend:**
    Otwórz *drugi* terminal
    ```
    cd frontend
    npm run dev
    ```

## Klucz API

Do zrobienia