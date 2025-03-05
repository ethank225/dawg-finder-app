import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
import concurrent.futures
import numpy as np
from thefuzz import process
from tqdm import tqdm  # To track progress
import schedule
import sqlite3
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Load environment variables
load_dotenv()

# URL and headers to simulate a browser request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": "https://myplan.washington.edu/course/"
}

cookies = {
    "_ga": "GA1.1.1466088051.1739521229",
    "_ga_29JYF25HLW": "GS1.1.1739521229.1.0.1739521237.0.0.0",
    "_ga_T11S2VFF6Z": "GS1.1.1739750638.1.0.1739750647.0.0.0",
    "_ga_TNNYEHDN9L": "GS1.1.1740161422.2.1.1740162167.0.0.0",
    "sessionId": "bd52f2c726d590d13f8cff31"
}

TABLE_NAME = "courses"
session = requests.Session()


def get_links(url, search, max_retries=10):
    """Fetch links from a webpage, implementing exponential backoff for retries."""
    retries = 0
    backoff_time = 2  # Initial backoff

    while retries < max_retries:
        try:
            response = session.get(url, headers=headers, cookies=cookies, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "html.parser")
                return [
                    url + a["href"] if not a["href"].startswith("http") else a["href"]
                    for a in soup.find_all("a", href=True)
                    if search in a["href"]
                ]
            print(f"Failed to fetch {url}. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {e}")

        retries += 1
        wait_time = backoff_time + random.uniform(0, 1)
        print(f"Retrying ({retries}/{max_retries}) after {wait_time:.2f} seconds...")
        time.sleep(wait_time)
        backoff_time *= 2  # Exponential backoff

    print("Max retries reached. Unable to fetch links.")
    return []


def fetch_course_details(url):
    """Fetch course details from the UW API."""
    full_course = url.split("/")[-1]
    course_num = full_course[-3:]
    course_prefix = full_course[:-3]
    fixed_full_course = course_prefix + "%20" + course_num
    api_url = f'https://course-app-api.planning.sis.uw.edu/api/courses/{fixed_full_course}/details'

    response = requests.get(api_url)
    if response.status_code == 200:
        course_data = response.json()
        data_list = []
        course_description = clean_text(course_data["courseSummaryDetails"].get("courseDescription", "No description"))

        for institution in course_data.get("courseOfferingInstitutionList", []):
            campus = institution["name"]
            for term in institution.get("courseOfferingTermList", []):
                term_name = term["term"]
                for activity in term.get("activityOfferingItemList", []):
                    for meeting in activity.get("meetingDetailsList", []):
                        data_list.append({
                            "Campus": campus,
                            "Term": term_name,
                            "Course Code": course_data["courseSummaryDetails"]["code"],
                            "Course Title": course_data["courseSummaryDetails"]["courseTitle"],
                            "Course Description": course_description,
                            "Activity Type": activity["activityOfferingType"],
                            "Instructor": activity.get("instructor", "N/A"),
                            "myPlanLink": api_url
                        })

        return pd.DataFrame(data_list)
    else:
        print(f"Failed request {api_url}. Status: {response.status_code}")
        return None


def clean_text(text):
    """Cleans HTML text and extracts useful content."""
    if pd.isna(text):
        return ""
    soup = BeautifulSoup(text, "html.parser")
    return re.sub(r'\s+', ' ', soup.get_text()).strip()


def process_dept_link(dept_link):
    """Fetch course details for a department link."""
    try:
        df = fetch_course_details(dept_link)
        return df if df is not None else None
    except Exception as e:
        print(f"Error processing {dept_link}: {e}")
        return None


def main():
    """Main function to scrape and process course data."""
    all_dfs = []
    all_links = ["https://www.washington.edu/students/crscat/hstry.html"]
    with concurrent.futures.ThreadPoolExecutor() as executor:
        for link in all_links:
            try:
                print("Searching: " + link)
                dept_links = [l.replace(" ", "%20") for l in get_links(link, "courses")]
                results = list(executor.map(process_dept_link, dept_links))
                all_dfs.extend([df for df in results if df is not None])
            except Exception as e:
                print(f"Error processing {link}: {e}")

    class_info_df = pd.concat(all_dfs, ignore_index=True) if all_dfs else pd.DataFrame()
    return class_info_df


def export_to_heroku(df):
    """Exports data to a Heroku Postgres database."""
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("❌ DATABASE_URL missing. Check .env settings.")

    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

    engine = create_engine(DATABASE_URL)
    df.to_sql(TABLE_NAME, engine, if_exists="replace", index=False)
    print("✅ Successfully exported data to Heroku Postgres!")


if __name__ == "__main__":
    class_info_grade = main()
    print("✅ Hourly update complete!")

    try:
        conn = sqlite3.connect("/Users/ethan/Desktop/all_data.db")
        class_info_grade.to_sql("courses", conn, if_exists="replace", index=False)
        conn.close()
    except Exception as e:
        print(f"SQLite error: {e}")

    export_to_heroku(class_info_grade)
