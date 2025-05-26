# backend/app.py
from flask import Flask, jsonify
from flask_cors import CORS
from decouple import config
import requests

app = Flask(__name__)
CORS(app)

# Load environment variables
OPENWEATHER_API_KEY = config('OPENWEATHER_API_KEY')
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5"

@app.route('/')
def home():
    return "Weather App Backend is Running!"

@app.route('/api/weather/<city>')
def get_weather(city):
    try:
        # Make request to OpenWeatherMap API
        response = requests.get(
            f"{OPENWEATHER_BASE_URL}/weather",
            params={
                "q": city,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"  # Use metric units
            }
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Get the weather data
        weather_data = response.json()
        
        # Format the response
        formatted_response = {
            "city": weather_data["name"],
            "temperature": weather_data["main"]["temp"],
            "feels_like": weather_data["main"]["feels_like"],
            "humidity": weather_data["main"]["humidity"],
            "description": weather_data["weather"][0]["description"],
            "icon": weather_data["weather"][0]["icon"]
        }
        
        return jsonify(formatted_response)
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch weather data", "details": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": "Invalid response from weather service", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
