from flask import Flask, jsonify
from flask_cors import CORS
from decouple import config
import requests

app = Flask(__name__)
CORS(app)

OPENWEATHER_API_KEY = config('OPENWEATHER_API_KEY')
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5"

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
        "icon": weather_data["weather"][0]["icon"],
        "wind_speed": weather_data["wind"]["speed"]
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

def make_weather_request(endpoint, city):
    try:
        response = requests.get(
            f"{OPENWEATHER_BASE_URL}/{endpoint}",
            params={
                "q": f"{city},PL",
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
        )
        response.raise_for_status()
        return response.json()
    
    except requests.exceptions.RequestException as e:
        raise Exception(f"Nie udało się pobrać danych pogodowych: {str(e)}")
    except Exception as e:
        raise Exception(f"Wystąpił nieoczekiwany błąd: {str(e)}")

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
        weather_data = make_weather_request("weather", city)
        return jsonify(format_weather_data(weather_data))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/forecast/<city>')
def get_forecast(city):
    if not is_valid_polish_city(city):
        return jsonify({"error": "Nieprawidłowe miasto. Wybierz z listy dostępnych miast."}), 400

    try:
        forecast_data = make_weather_request("forecast", city)
        return jsonify(format_forecast_data(forecast_data))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
