import os
import tempfile
import pytest
from unittest.mock import patch
from main import app, POLISH_CITIES
import db

@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    db.DB_PATH = db_path # Ustawienie ścieżki bazy danych na tymczasowy plik
    app.config['TESTING'] = True

    db.init_db()
    with app.test_client() as client:
        yield client

    os.close(db_fd)
    os.unlink(db_path)

def test_weather_saves_to_history(client):
    test_city = POLISH_CITIES[0]

    mocked_response = {
        "name": test_city,
        "main": {"temp": 20, "feels_like": 19, "humidity": 60},
        "weather": [{"description": "cloudy", "icon": "02d"}],
        "wind": {"speed": 4.5}
    }

    
    with patch('main.make_weather_request', return_value=mocked_response):
        weather_res = client.get(f'/api/weather/{test_city}')
        assert weather_res.status_code == 200

    # Sprawdzenie historii
    history_res = client.get('/api/history')
    assert history_res.status_code == 200
    history_data = history_res.get_json()
    assert test_city in history_data
