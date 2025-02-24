from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the DawgFinder API!"})

@app.route('/api/data')
def get_data():
    return jsonify({"data": ["item1", "item2", "item3"]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
