from sqlalchemy import create_engine
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Heroku database URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set. Check your .env file or Heroku config.")

# Fix Heroku's outdated URL scheme
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Read JSON files
class_data = pd.read_json("/Users/ethan/Desktop/dawgfinder/backend/data/grade_catalog.json")
rmp_data = pd.read_json("/Users/ethan/Desktop/dawgfinder/backend/data/rmp_info.json")

# Upload to Heroku Postgres
engine = create_engine(DATABASE_URL)
class_data.to_sql("grade_data", engine, if_exists="replace", index=False)
rmp_data.to_sql("rmp_data", engine, if_exists="replace", index=False)

print("✅ Successfully uploaded data to Heroku Postgres!")
