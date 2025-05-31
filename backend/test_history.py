import os
import tempfile
import pytest
from main import app
from db import init_db, save_search, get_recent_searches

@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    app.config['TESTING'] = True
    app.config['DATABASE'] = db_path

    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client

    os.close(db_fd)
    os.unlink(db_path)

def test_save_and_get_search():
    init_db()
    save_search("Warszawa")
    save_search("Kraków")
    history = get_recent_searches(limit=2)
    assert history == ["Warszawa", "Kraków"]


def test_api_history(client):
    # Wstaw dane ręcznie
    save_search("Wrocław")
    save_search("Gdańsk")

    response = client.get('/api/history')
    assert response.status_code == 200
    assert "Wrocław" in response.get_json()
    assert "Gdańsk" in response.get_json()
