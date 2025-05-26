# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from decouple import config
import requests
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Load environment variables
OPENWEATHER_API_KEY = config('OPENWEATHER_API_KEY')
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5"

# List of 10 biggest Polish cities
POLISH_CITIES = [
    "Warszawa",
    "Kraków",
    "Łódź",
    "Wrocław",
    "Poznań",
    "Gdańsk",
    "Szczecin",
    "Bydgoszcz",
    "Lublin",
    "Katowice"
]

def is_valid_polish_city(city):
    return city in POLISH_CITIES

def format_weather_data(weather_data):
    return {
        "city": weather_data["name"],
        "temperature": weather_data["main"]["temp"],
        "feels_like": weather_data["main"]["feels_like"],
        "humidity": weather_data["main"]["humidity"],
        "description": weather_data["weather"][0]["description"],
        "icon": weather_data["weather"][0]["icon"]
    }

def format_forecast_data(forecast_data):
    return {
        "city": forecast_data["city"]["name"],
        "forecast": [
            {
                "datetime": item["dt_txt"],
                "temperature": item["main"]["temp"],
                "feels_like": item["main"]["feels_like"],
                "humidity": item["main"]["humidity"],
                "description": item["weather"][0]["description"],
                "icon": item["weather"][0]["icon"],
                "wind_speed": item["wind"]["speed"]
            }
            for item in forecast_data["list"]
        ]
    }

@app.route('/')
def home():
    return "Aplikacja Pogodowa - Backend Działa!"

@app.route('/api/cities')
def get_cities():
    return jsonify(POLISH_CITIES)

@app.route('/api/weather/<city>')
def get_weather(city):
    if not is_valid_polish_city(city):
        return jsonify({"error": "Nieprawidłowe miasto. Wybierz z listy dostępnych miast."}), 400

    try:
        # Make request to OpenWeatherMap API
        response = requests.get(
            f"{OPENWEATHER_BASE_URL}/weather",
            params={
                "q": f"{city},PL",
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Get the weather data
        weather_data = response.json()
        
        # Format the response
        return jsonify(format_weather_data(weather_data))
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Nie udało się pobrać danych pogodowych", "details": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": "Nieprawidłowa odpowiedź z serwisu pogodowego", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Wystąpił nieoczekiwany błąd", "details": str(e)}), 500

@app.route('/api/forecast/<city>')
def get_forecast(city):
    if not is_valid_polish_city(city):
        return jsonify({"error": "Nieprawidłowe miasto. Wybierz z listy dostępnych miast."}), 400

    try:
        # Make request to OpenWeatherMap API for 5-day/3-hour forecast
        response = requests.get(
            f"{OPENWEATHER_BASE_URL}/forecast",
            params={
                "q": f"{city},PL",
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Get the forecast data
        forecast_data = response.json()
        
        # Format the response
        return jsonify(format_forecast_data(forecast_data))
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Nie udało się pobrać prognozy pogody", "details": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": "Nieprawidłowa odpowiedź prognozy", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Wystąpił nieoczekiwany błąd", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
