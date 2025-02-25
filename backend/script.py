# backend/script.py
import json

def main():
    data = {"message": "Hello from Python!"}
    print(json.dumps(data))  # Ensure output is JSON

if __name__ == "__main__":
    main()
