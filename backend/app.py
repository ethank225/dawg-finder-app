from flask import Flask
import threading
from updateDB import schedule_updates  # Import the scheduling function

app = Flask(__name__)

@app.route("/")
def home():
    return "Flask App Running with Scheduled Updates!"

# Start the update script in a background thread
if __name__ == "__main__":
    updater_thread = threading.Thread(target=schedule_updates, daemon=True)
    updater_thread.start()
    app.run(host="0.0.0.0", port=4000, debug=True)
