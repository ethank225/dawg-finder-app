import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
import time
import random
import concurrent.futures
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import numpy as np
from thefuzz import process
from tqdm import tqdm  # To track progress
import re  # For removing middle names
import schedule
import time
import sqlite3
import numpy as np
import os
from dotenv import load_dotenv
import pandas as pd
from sqlalchemy import create_engine, text
import os
import requests
import time

# Add these imports for Heroku export
from sqlalchemy import create_engine

# Make sure you have psycopg2 installed, typically: pip install psycopg2-binary

# URL to scrape

# Simulate a browser request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Referer": "https://myplan.washington.edu/course/",
}

cookies = {
    "_ga": "GA1.1.1466088051.1739521229",
    "_ga_29JYF25HLW": "GS1.1.1739521229.1.0.1739521237.0.0.0",
    "_ga_T11S2VFF6Z": "GS1.1.1739750638.1.0.1739750647.0.0.0",
    "_ga_TNNYEHDN9L": "GS1.1.1740161422.2.1.1740162167.0.0.0",
    "sessionId": "bd52f2c726d590d13f8cff31",
}

session = requests.Session()  # Use a session to maintain cookies

# Load environment variables from .env.local
def fetch_json_from_drive(file_id):
    """Fetch JSON data from a public Google Drive file."""
    url = f"https://drive.google.com/uc?id={file_id}"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()  # Convert JSON response
    else:
        raise Exception(f"Failed to fetch JSON: {response.status_code}")


def get_links(url, search, max_retries=10):
    session = requests.Session()  # Persistent connection
    retries = 0
    while retries < max_retries:
        try:
            response = session.get(
                url, headers=headers, cookies=cookies, timeout=10
            )  # Set timeout
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "html.parser")
                # Extract and filter links
                good_links = [
                    url + a["href"] if not a["href"].startswith("http") else a["href"]
                    for a in soup.find_all("a", href=True)
                    if search in a["href"]
                ]
                return good_links
            else:
                print(
                    f"Failed to fetch the webpage. Status code: {response.status_code}"
                )
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {e}")

        retries += 1
        print(f"Retrying ({retries}/{max_retries})...")

    print("Max retries reached. Unable to fetch links.")
    return []


def fetch_course_details(url, max_retries=3, retry_delay=5):
    """
    Extracts course code from URL, formats it correctly, and fetches course details.
    Retries up to max_retries times in case of failure.
    """
    full_course = url.split("/")[-1]  # Get last part of URL
    course_num = full_course[-3:]  # Last 3 characters (digits)
    course_prefix = full_course[:-3]  # Everything else before the last 3 characters
    fixed_full_course = course_prefix + "%20" + course_num  # Combine it back

    # Define the API endpoint
    api_url = f"https://course-app-api.planning.sis.uw.edu/api/courses/{fixed_full_course}/details"

    retries = 0
    while retries < max_retries:
        try:
            response = requests.get(api_url, timeout=10)
            if response.status_code == 200:
                course_data = response.json()
                return process_course_data(
                    course_data, api_url
                )  # Process and return data
            else:
                print(
                    f"Request failed with status code {response.status_code}, retrying..."
                )
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {api_url}: {e}, retrying...")

        retries += 1
        time.sleep(retry_delay)  # Wait before retrying

    print(f"Max retries reached. Unable to fetch data from {api_url}")
    return None  # Return None if all retries fail


def process_course_data(course_data, api_url):
    """
    Processes course JSON data and returns a DataFrame.
    """
    data_list = []
    course_description = clean_text(
        course_data["courseSummaryDetails"].get(
            "courseDescription", "No description available"
        )
    )

    for institution in course_data.get("courseOfferingInstitutionList", []):
        campus = institution["name"]
        for term in institution.get("courseOfferingTermList", []):
            term_name = term["term"]
            for activity in term.get("activityOfferingItemList", []):
                for meeting in activity.get("meetingDetailsList", []):
                    data_list.append(
                        {
                            "Campus": campus,
                            "Term": term_name,
                            "Course Code": course_data["courseSummaryDetails"]["code"],
                            "Course Title": course_data["courseSummaryDetails"][
                                "courseTitle"
                            ],
                            "Course Description": course_description,
                            "Activity Type": activity["activityOfferingType"],
                            "Section": activity["code"],
                            "Credits": activity["credits"],
                            "Days": meeting.get("days", "N/A"),
                            "Time": meeting.get("time", "N/A"),
                            "Building": meeting.get("building", "N/A"),
                            "Room": meeting.get("room", "N/A"),
                            "Instructor": activity.get("instructor", "N/A"),
                            "Credit": course_data["courseSummaryDetails"].get(
                                "credit", "N/A"
                            ),
                            "GenEd Requirements": ", ".join(
                                course_data["courseSummaryDetails"].get(
                                    "abbrGenEdRequirements", []
                                )
                            ),
                            "Registration Code": activity.get(
                                "registrationCode", "N/A"
                            ),
                            "enrollCount": activity.get("enrollCount", "N/A"),
                            "enrollMaximum": activity.get("enrollMaximum", "N/A"),
                            "myPlanLink": api_url,
                        }
                    )
    return pd.DataFrame(data_list)


def clean_text(text):
    if pd.isna(text):  # Handle NaN values
        return ""

    soup = BeautifulSoup(text, "html.parser")

    # Extract course numbers from the `data-text` attributes in <span> tags
    for span in soup.find_all("span", class_="linkified"):
        if span.has_attr("data-text"):
            span.replace_with(
                span["data-text"]
            )  # Replace <span> with the text inside data-text

    cleaned_text = soup.get_text()  # Extract plain text
    cleaned_text = re.sub(r"\s+", " ", cleaned_text).strip()  # Normalize spaces
    return cleaned_text


def process_dept_link(dept_link):
    """Fetch course details for a department link."""
    try:
        df = fetch_course_details(dept_link)
        if df is not None:
            return df
    except Exception as e:
        print(f"Error processing {dept_link}: {e}")
    return None


def main():
    all_dfs = []  # List to store DataFrames
    # all_links = get_links("https://www.washington.edu/students/crscat/", "html")
    all_links = ['https://www.washington.edu/students/crscat/econ.html']

    with concurrent.futures.ThreadPoolExecutor() as executor:
        for link in all_links:
            try:
                print("searching: " + link, flush=True)
                dept_links = get_links(link, "courses")
                dept_links = [link.replace(" ", "%20") for link in dept_links]
                results = list(executor.map(process_dept_link, dept_links))
                # Append non-None results to all_dfs
                all_dfs.extend([df for df in results if df is not None])
            except Exception as e:
                print(f"Error processing {link}: {e}")

    # Combine all DataFrames if any exist
    class_info_df = pd.concat(all_dfs, ignore_index=True) if all_dfs else pd.DataFrame()
    class_info_df["index"] = class_info_df["Course Code"].str.replace(" ", "")

    # ----- Additional Data Merging for Grades -----
    class_data_drive = "1a9cxucOZa3Ix-D9f5PCc8xXfhKIOwoXf"
    class_data = fetch_json_from_drive(class_data_drive).T

    coi_df = class_data["coi_data"].apply(pd.Series)
    gpa_df = class_data["gpa_distro"].apply(pd.Series)

    # Merge back into original dataframe
    class_data = class_data.drop(columns=["coi_data"]).join(coi_df)
    class_data = class_data.drop(columns=["gpa_distro"]).join(gpa_df)
    class_data.columns = class_data.columns.astype(str)
    class_data["course_id"] = class_data["course_id"].str.replace(" ", "")

    gpa_df = class_data[[str(i) for i in range(0, 41)]].applymap(
        lambda x: x["count"] if isinstance(x, dict) else None
    )
    gpa_df.columns = [f"{col}" for col in gpa_df.columns]
    class_data = class_data.drop(columns=[str(i) for i in range(0, 41)]).join(gpa_df)

    # Extract GPA distribution data
    gpa_df = class_data[[str(i) for i in range(0, 41)]]
    # Convert column names to GPA values (0.0 to 4.0)
    gpa_values = np.array(
        [i / 10 for i in range(41)], dtype=float
    )  # GPA bins from 0.0 to 4.0

    # Compute total number of students in each class
    total_counts = gpa_df.sum(axis=1)

    # Compute mean GPA for each class
    mean_gpa = (gpa_df * gpa_values).sum(axis=1) / total_counts

    # Expand data to compute median & standard deviation
    expanded_data = gpa_df.apply(
        lambda row: np.repeat(gpa_values, row.values.astype(int)), axis=1
    )
    median_gpa = expanded_data.apply(np.median)
    std_gpa = expanded_data.apply(np.std)

    # Compute percentage of 4.0 GPAs
    four_point_zero_percent = (
        gpa_df["40"] / total_counts
    ) * 100  # Column '40' corresponds to GPA 4.0

    # Create summary dataframe
    grade_summary_df = pd.DataFrame(
        {
            "mean": mean_gpa,
            "median": median_gpa,
            "sd": std_gpa,
            "fourpointo_per": four_point_zero_percent,
        }
    ).fillna(0)

    grade_summary_df = grade_summary_df.reset_index()
    gpa_df = gpa_df.reset_index()

    # Merge grade summaries
    grade_summary_df = pd.merge(grade_summary_df, gpa_df, on="index")
    class_info_grade = pd.merge(class_info_df, grade_summary_df, on="index", how="left")

    # Parse Start/End times
    class_info_grade[["Start", "End"]] = class_info_grade["Time"].str.split(
        "-", expand=True
    )
    class_info_grade["Start"] = class_info_grade["Start"].str.strip()
    class_info_grade["End"] = (
        class_info_grade["End"].str.strip().str.replace("z", "", regex=False)
    )

    def convert_to_military(time_str):
        try:
            return pd.to_datetime(time_str, format="%I:%M %p").strftime("%H:%M")
        except Exception:
            return None  # Return None (or NaN) for invalid values

    class_info_grade["Start"] = class_info_grade["Start"].apply(convert_to_military)
    class_info_grade["End"] = class_info_grade["End"].apply(convert_to_military)
    class_info_grade["prefix"] = class_info_grade["index"].str[:-3]

    rmp_drive_code = "1NMaKrCSJh3OvV7JOfqfg85qM_qcBzw3q"
    # Fuzzy matching with RMP data
    rmp_data = fetch_json_from_drive(rmp_drive_code)
    class_info_grade["Instructor"] = (
        class_info_grade["Instructor"].astype(str).fillna("")
    )
    rmp_data["Name"] = rmp_data["Name"].astype(str).fillna("")

    tqdm.pandas()

    def remove_middle_name(name):
        parts = name.split()
        if len(parts) == 3:  # If exactly three parts (First Middle Last)
            return f"{parts[0]} {parts[2]}"  # Return First and Last
        return name

    def fuzzy_merge(class_df, rmp_df, class_key, rmp_key, threshold):
        def get_best_match(name):
            if not name:
                return None
            match = process.extractOne(name, rmp_df[rmp_key], score_cutoff=threshold)
            # If no match, try again without the middle name
            if match is None:
                name_no_middle = remove_middle_name(name)
                if name_no_middle != name:  # Avoid redundant checking
                    match = process.extractOne(
                        name_no_middle, rmp_df[rmp_key], score_cutoff=threshold
                    )
            return match

        matches = class_df[class_key].progress_apply(get_best_match)
        matches = matches.apply(
            lambda x: (x[0], x[1]) if x is not None else ("No Match", 0)
        )
        match_df = pd.DataFrame(
            matches.tolist(), index=class_df.index, columns=["Matched_Name", "Score"]
        )
        match_df["Original_Instructor"] = class_df[class_key]
        class_df["Matched_Name"] = match_df["Matched_Name"]

        return (
            pd.merge(
                class_df, rmp_df, left_on="Matched_Name", right_on=rmp_key, how="left"
            ),
            match_df,
        )

    # 1st fuzzy merge with RMP data
    class_info_grade_rmp, match_df = fuzzy_merge(
        class_info_grade, rmp_data, "Instructor", "Name", threshold=95
    )

    # 2nd fuzzy merge with course evaluations
    course_eval_ratings = pd.read_json(
        "/backend/data/course_eval_ratings.json"
    )
    merged, match_df = fuzzy_merge(
        class_info_grade_rmp,
        course_eval_ratings,
        "Instructor",
        "Instructor Name",
        threshold=95,
    )

    return merged


# Define columns for both tables
columns = {
    "Campus": "TEXT", "Term": "TEXT", "Course Code": "TEXT", "Course Title": "TEXT",
    "Course Description": "TEXT", "Activity Type": "TEXT", "Section": "TEXT",
    "Credits": "TEXT", "Days": "TEXT", "Time": "TEXT", "Building": "TEXT",
    "Room": "TEXT", "Instructor": "TEXT", "Credit": "TEXT", "GenEd Requirements": "TEXT",
    "Registration Code": "TEXT", "enrollCount": "INT", "enrollMaximum": "INT", "myPlanLink": "TEXT",
    "index": "TEXT", "mean": "FLOAT", "median": "FLOAT", "sd": "FLOAT", "fourpointo_per": "FLOAT",
    **{str(i): "FLOAT" for i in range(41)},  # GPA Distribution (0-40)
    "Start": "TEXT", "End": "TEXT", "prefix": "TEXT", "Matched_Name": "TEXT",
    "Name": "TEXT", "Rating": "FLOAT", "Difficulty": "FLOAT", "Link": "TEXT",
    "Department": "TEXT", "Instructor Name": "TEXT", "amount_learned_median": "FLOAT",
    "grading_techniques_median": "FLOAT", "instructors_contribution_median": "FLOAT",
    "instructors_effectiveness_median": "FLOAT", "instuctors_interest_median": "FLOAT",
    "the_course_as_a_whole_median": "FLOAT", "the_course_content_median": "FLOAT",
    "Clean_Course_Code": "TEXT"
}


def create_tables():
    if not DATABASE_URL:
        raise ValueError("❌ DATABASE_URL is missing. Ensure .env.local is loaded properly.")

    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        # Convert columns dictionary to SQL format: `"ColumnName" ColumnType`
        columns_sql = ",\n".join([f'"{col}" {dtype}' for col, dtype in columns.items()])

        # Create `courses` table
        conn.execute(text(f"""
            CREATE TABLE IF NOT EXISTS courses (
                "UUID" UUID PRIMARY KEY,
                {columns_sql}
            );
        """))

        # Create `sections` table (identical structure)
        conn.execute(text(f"""
            CREATE TABLE IF NOT EXISTS sections (
                "UUID" UUID PRIMARY KEY,
                {columns_sql}
            );
        """))

        conn.commit()
    print("✅ Successfully created both tables in Heroku Postgres!")


def export_to_heroku(df, table_name):
    if not DATABASE_URL:
        raise ValueError("❌ DATABASE_URL is missing. Ensure .env.local is loaded properly.")

    engine = create_engine(DATABASE_URL)

    df.to_sql(table_name, engine, if_exists="replace", index=False)
    print(f"✅ Successfully exported data to {table_name} in Heroku Postgres!")


if __name__ == "__main__":
    DATABASE_URL = os.getenv("DATABASE_URL")

    df = main()  # 1) Fetch & process new data

    #clean the df
    df = df.drop_duplicates(['Course Code', "Section", "Instructor Name", "Term"])
    df['Clean_Course_Code'] = df['Course_Code'].str.replace(" ", "", regex=True)
    df['UUID'] = df['Clean_Course_Code'] + df['Section'].apply(lambda x: x[0] if len(x) == 2 else x) + df['Term']
    df['UUID'] = df['UUID'].str.replace(" ", "", regex=True)

    filtered_df = df[df['Activity Type'].isin(['lecture', 'quiz', 'seminar', 'laboratory', 'studio'])]
    df_lectures = filtered_df[filtered_df['Section'].str.len() == 1]
    df_sections = filtered_df[filtered_df['Section'].str.len() == 2]


    print("✅ Hourly update complete!")
    # Get DATABASE_URL from the environment

    # Ensure compatibility with SQLAlchemy (Heroku sometimes uses `postgres://`)
    if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

    create_tables()


    export_to_heroku(df_lectures, "courses")
    export_to_heroku(df_sections, "sections")


