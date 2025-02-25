from flask import Flask, jsonify
from updateDB import schedule_updates  # Your function to update the database

app = Flask(__name__)

@app.route("/")
def home():
    return "Flask App Running on Vercel!"

@app.route("/update", methods=["GET"])
def update_db():
    """Trigger the database update manually."""
    schedule_updates()  # Run the update function when requested
    return jsonify({"message": "Database update triggered!"})

# Required for Vercel
def handler(event, context):
    return app(event, context)
