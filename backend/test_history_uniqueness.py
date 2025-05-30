import os
import tempfile
import pytest
from unittest.mock import patch
from main import app, POLISH_CITIES
import db

@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    db.DB_PATH = db_path
    app.config['TESTING'] = True

    db.init_db()
    with app.test_client() as client:
        yield client

    os.close(db_fd)
    os.unlink(db_path)

def test_duplicate_searches_do_not_duplicate_history(client):
    city = POLISH_CITIES[0]

    mocked_weather = {
        "name": city,
        "main": {"temp": 10, "feels_like": 9, "humidity": 80},
        "weather": [{"description": "fog", "icon": "50d"}],
        "wind": {"speed": 2.0}
    }

    # Wykonaj 2 zapytania dla tego samego miasta
    with patch('main.make_weather_request', return_value=mocked_weather):
        client.get(f'/api/weather/{city}')
        client.get(f'/api/weather/{city}')


    response = client.get('/api/history')
    history = response.get_json()
    assert history.count(city) == 1
