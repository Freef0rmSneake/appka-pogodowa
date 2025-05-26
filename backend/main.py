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
        return jsonify({"error": "Failed to fetch weather data", "details": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": "Invalid response from weather service", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

@app.route('/api/forecast/<city>')
def get_forecast(city):
    try:
        # Make request to OpenWeatherMap API for 5-day/3-hour forecast
        response = requests.get(
            f"{OPENWEATHER_BASE_URL}/forecast",
            params={
                "q": city,
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
        return jsonify({"error": "Failed to fetch forecast data", "details": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": "Invalid forecast response", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

@app.route('/api/forecast/daily/<city>')
def get_daily_forecast(city):
    try:
        # Make request to OpenWeatherMap API for 5-day/3-hour forecast
        response = requests.get(
            f"{OPENWEATHER_BASE_URL}/forecast",
            params={
                "q": city,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Get the forecast data
        forecast_data = response.json()
        
        # Process the 3-hour forecast data to get daily averages
        daily_data = {}
        for item in forecast_data["list"]:
            date = datetime.strptime(item["dt_txt"], "%Y-%m-%d %H:%M:%S").date()
            if date not in daily_data:
                daily_data[date] = {
                    "temps": [],
                    "humidity": [],
                    "descriptions": [],
                    "icons": [],
                    "wind_speeds": []
                }
            
            daily_data[date]["temps"].append(item["main"]["temp"])
            daily_data[date]["humidity"].append(item["main"]["humidity"])
            daily_data[date]["descriptions"].append(item["weather"][0]["description"])
            daily_data[date]["icons"].append(item["weather"][0]["icon"])
            daily_data[date]["wind_speeds"].append(item["wind"]["speed"])
        
        # Format the response with daily averages
        formatted_forecast = {
            "city": forecast_data["city"]["name"],
            "forecast": [
                {
                    "date": date.strftime('%Y-%m-%d'),
                    "temperature": {
                        "day": sum(data["temps"]) / len(data["temps"]),
                        "min": min(data["temps"]),
                        "max": max(data["temps"])
                    },
                    "humidity": sum(data["humidity"]) / len(data["humidity"]),
                    "description": max(set(data["descriptions"]), key=data["descriptions"].count),
                    "icon": max(set(data["icons"]), key=data["icons"].count),
                    "wind_speed": sum(data["wind_speeds"]) / len(data["wind_speeds"])
                }
                for date, data in sorted(daily_data.items())
            ]
        }
        
        return jsonify(formatted_forecast)
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to fetch daily forecast data", "details": str(e)}), 500
    except KeyError as e:
        return jsonify({"error": "Invalid daily forecast response", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
