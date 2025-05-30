import sqlite3
from contextlib import closing

DB_PATH = 'search_history.db'

def init_db():
    with closing(sqlite3.connect(DB_PATH)) as conn:
        with conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS search_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    city TEXT NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')

def save_search(city):
    with closing(sqlite3.connect(DB_PATH)) as conn:
        with conn:
            conn.execute(
                'DELETE FROM search_history WHERE city = ?',
                (city,)
            )
            conn.execute(
                'INSERT INTO search_history (city) VALUES (?)',
                (city,)
            )


def get_recent_searches(limit=10):
    with closing(sqlite3.connect(DB_PATH)) as conn:
        cursor = conn.execute(
            'SELECT city FROM search_history ORDER BY timestamp DESC LIMIT ?',
            (limit,)
        )
        return [row[0] for row in cursor.fetchall()]
