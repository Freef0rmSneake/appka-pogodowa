# backend/app.py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from Flask Backend!"

@app.route('/api/test')
def api_test():
    return {"message": "API is working!"}  # Przykładowe API zwracające JSON

if __name__ == '__main__':
    app.run(debug=True)
