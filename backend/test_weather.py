import pytest
from unittest.mock import patch
from main import app, POLISH_CITIES

@pytest.fixture
def client():
    app.config['TESTING'] = True
    return app.test_client()

def test_get_weather_success(client):
    test_city = POLISH_CITIES[0]
    mocked_response = {
        "name": test_city,
        "main": {
            "temp": 15,
            "feels_like": 13,
            "humidity": 50
        },
        "weather": [{"description": "clear sky", "icon": "01d"}],
        "wind": {"speed": 5}
    }

    with patch('main.make_weather_request', return_value=mocked_response):
        response = client.get(f'/api/weather/{test_city}')
        assert response.status_code == 200
        data = response.get_json()
        assert data["city"] == test_city
        assert "temperature" in data
        assert "description" in data

def test_get_weather_invalid_city(client):
    response = client.get('/api/weather/NieistniejąceMiasto')
    assert response.status_code == 400
    assert "error" in response.get_json()

def test_get_weather_api_error(client):
    with patch('main.make_weather_request', side_effect=Exception("Błąd API")):
        city = POLISH_CITIES[0]
        response = client.get(f'/api/weather/{city}')
        assert response.status_code == 500
        assert "error" in response.get_json()
