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


# URL to scrape


# Simulate a browser request
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

DB_PATH = "/Users/ethan/Desktop/dawgfinder/backend/data/all_data.db"


session = requests.Session()  # Use a session to maintain cookies


# Send a GET request with headers
def get_links(url, search, max_retries=3):
    session = requests.Session()  # Persistent connection
    retries = 0

    while retries < max_retries:
        try:
            response = session.get(url, headers=headers, cookies=cookies, timeout=10)  # Set timeout

            if response.status_code == 200:
                soup = BeautifulSoup(response.text, "html.parser")

                # Extract and filter links
                good_links = [url + a["href"] if not a["href"].startswith("http") else a["href"]
                              for a in soup.find_all("a", href=True) if search in a["href"]]

                return good_links

            else:
                print(f"Failed to fetch the webpage. Status code: {response.status_code}")

        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {e}")

        retries += 1
        print(f"Retrying ({retries}/{max_retries})...")

    print("Max retries reached. Unable to fetch links.")
    return []

#Get the Course Details
def fetch_course_details(url):
    """
    Extracts course code from URL, formats it correctly, and fetches course details.
    """
    full_course = url.split("/")[-1]  # Get last part of URL

    course_num = full_course[-3:]  # Last 3 characters (digits)
    course_prefix = full_course[:-3]  # Everything else before the last 3 characters
    fixed_full_course = course_prefix + "%20" + course_num  # Combine it back

    # Define the API endpoint
    api_url = f'https://course-app-api.planning.sis.uw.edu/api/courses/{fixed_full_course}/details'

    # Make the GET request to the API
    response = requests.get(api_url)

    # Check if the request was successful
    if response.status_code == 200:
        course_data = response.json()

        # Extract course summary details
        data_list = []
        course_description = course_data["courseSummaryDetails"].get("courseDescription", "No description available")

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
                                "Course Title": course_data["courseSummaryDetails"]["courseTitle"],
                                "Course Description": course_description,
                                "Activity Type": activity["activityOfferingType"],
                                "Section": activity["code"],
                                "Credits": activity["credits"],
                                "Days": meeting.get("days", "N/A"),
                                "Time": meeting.get("time", "N/A"),
                                "Building": meeting.get("building", "N/A"),
                                "Room": meeting.get("room", "N/A"),
                                "Instructor": activity.get("instructor", "N/A"),
                                "Credit": course_data["courseSummaryDetails"].get("credit", "N/A"),
                                "GenEd Requirements": ", ".join(course_data["courseSummaryDetails"].get("abbrGenEdRequirements", [])),
                                "Registration Code": activity.get("registrationCode", "N/A"),  # Added Registration Code
                                "enrollCount": activity.get("enrollCount", "N/A"),  # Added Registration Code
                                "enrollMaximum": activity.get("enrollMaximum", "N/A")  # Added Registration Code
                            }
                        )

        # Create DataFrame
        df = pd.DataFrame(data_list)
        return df

    else:
        print(f"Request failed with status code {response.status_code}")
        return None

#Process the Department Link
def process_dept_link(dept_link):
    """Fetch course details for a department link."""
    try:
        df = fetch_course_details(dept_link)
        if df is not None:
            return df
    except Exception as e:
        print(f"Error processing {dept_link}: {e}")
    return None

#Updates the SQLite Database
def update_database(df):
    """Updates the SQLite database with the latest course data."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_code TEXT,
            course_description TEXT,
            course_title TEXT,
            credits TEXT,
            prefix TEXT,
            start_time TEXT,
            end_time TEXT,
            instructor TEXT,
            rating TEXT,
            mean_gpa REAL,
            term TEXT,
            building TEXT,
            gen_ed_requirements TEXT,
            days TEXT,
            section TEXT,
            registration_code TEXT
        )
    """)

    # Insert or update records
    df.to_sql("courses", conn, if_exists="replace", index=False)

    conn.commit()
    conn.close()
    print("✅ Database updated successfully!")

#Most of the data processing is done here
def main():
  all_dfs = []  # List to store DataFrames

  all_links = get_links('https://www.washington.edu/students/crscat/', 'html')

  for link in all_links:
      try:
          print("searching: " + link)
          dept_links = get_links(link, "courses")
          dept_links = [link.replace(" ", "%20") for link in dept_links]

          # Use ThreadPoolExecutor to process department links in parallel
          with concurrent.futures.ThreadPoolExecutor() as executor:
              results = list(executor.map(process_dept_link, dept_links))

          # Append non-None results to all_dfs
          all_dfs.extend([df for df in results if df is not None])

      except Exception as e:
          print(f"Error processing {link}: {e}")

  # Combine all DataFrames if any exist
  class_info_df = pd.concat(all_dfs, ignore_index=True) if all_dfs else pd.DataFrame()
  class_info_df['index'] =  class_info_df['Course Code'].str.replace(" ", "")

  #Done setting up class_info_df

  #now set up class_data (Grades)
  class_data = pd.read_json('/Users/ethan/Desktop/dawgfinder/backend/data/grade_catalog.json').T

  coi_df = class_data['coi_data'].apply(pd.Series)
  gpa_df = class_data['gpa_distro'].apply(pd.Series)


  # Merge back into original dataframe (if needed)
  class_data = class_data.drop(columns=['coi_data']).join(coi_df)
  class_data = class_data.drop(columns=['gpa_distro']).join(gpa_df)

  class_data.columns = class_data.columns.astype(str)


  class_data['course_id'] = class_data['course_id'].str.replace(" ", "")


  gpa_df = class_data[[str(i) for i in range(0, 41)]].applymap(lambda x: x['count'] if isinstance(x, dict) else None)
  gpa_df.columns = [f"{col}" for col in gpa_df.columns]


  class_data = class_data.drop(columns=[str(i) for i in range(0, 41)]).join(gpa_df)

  # Extract GPA distribution data
  gpa_df = class_data[[str(i) for i in range(0, 41)]]

  # Convert column names to GPA values (0.0 to 4.0)
  gpa_values = np.array([i / 10 for i in range(41)], dtype = float)  # GPA bins from 0.0 to 4.0

  # Compute total number of students in each class
  total_counts = gpa_df.sum(axis=1)

  # Compute mean GPA for each class
  mean_gpa = (gpa_df * gpa_values).sum(axis=1) / total_counts

  # Expand data to compute median & standard deviation
  expanded_data = gpa_df.apply(lambda row: np.repeat(gpa_values, row.values.astype(int)), axis=1)
  median_gpa = expanded_data.apply(np.median)
  std_gpa = expanded_data.apply(np.std)

  # Compute percentage of 4.0 GPAs
  four_point_zero_percent = (gpa_df['40'] / total_counts) * 100  # Column '40' corresponds to GPA 4.0

  # Create summary dataframe
  grade_summary_df = pd.DataFrame({
      'mean': mean_gpa,
      'median': median_gpa,
      'sd': std_gpa,
      'fourpointo_per': four_point_zero_percent
  }).fillna(0)


  grade_summary_df

  grade_summary_df = grade_summary_df.reset_index()
  grade_summary_df['index']

  #class_info and the grade summary
  class_info_grade = pd.merge(class_info_df, grade_summary_df, on="index", how="left")

  class_info_grade[['Start', 'End']] = class_info_grade['Time'].str.split("-", expand=True)
  class_info_grade['Start'] = class_info_grade['Start'].str.strip()
  class_info_grade['End'] = class_info_grade['End'].str.strip().str.replace('z', '', regex=False)

  # Convert times to 24-hour format, handling errors
  def convert_to_military(time_str):
      try:
          return pd.to_datetime(time_str, format='%I:%M %p').strftime('%H:%M')
      except Exception:
          return None  # Return None (or NaN) for invalid values

  class_info_grade['Start'] = class_info_grade['Start'].apply(convert_to_military)
  class_info_grade['End'] = class_info_grade['End'].apply(convert_to_military)
  class_info_grade['prefix'] = class_info_grade['index'].str[:-3]


  rmp_data = pd.read_json('/Users/ethan/Desktop/dawgfinder/backend/data/rmp_info.json')

  class_info_grade['Instructor'] = class_info_grade['Instructor'].astype(str).fillna("")
  rmp_data['Name'] = rmp_data['Name'].astype(str).fillna("")

  tqdm.pandas()

  # Function to remove the middle name (assumes format "First Middle Last")
  def remove_middle_name(name):
      parts = name.split()
      if len(parts) == 3:  # If there are exactly three parts (First Middle Last)
          return f"{parts[0]} {parts[2]}"  # Return First and Last only
      return name  # If not three parts, return unchanged

  # Fuzzy merge with fallback for names without middle name
  def fuzzy_merge(class_df, rmp_df, class_key, rmp_key, threshold):
    def get_best_match(name):
        if not name:
            return None
        match = process.extractOne(name, rmp_df[rmp_key], score_cutoff=threshold)

        # If no match, try again without the middle name
        if match is None:
            name_no_middle = remove_middle_name(name)
            if name_no_middle != name:  # Avoid redundant checking
                match = process.extractOne(name_no_middle, rmp_df[rmp_key], score_cutoff=threshold)

        return match

    # Apply fuzzy matching
    matches = class_df[class_key].progress_apply(get_best_match)

    # Ensure matches are tuples (handle None cases)
    matches = matches.apply(lambda x: (x[0], x[1]) if x is not None else ("No Match", 0))

    # Convert results into a DataFrame
    match_df = pd.DataFrame(matches.tolist(), index=class_df.index, columns=['Matched_Name', 'Score'])
    match_df['Original_Instructor'] = class_df[class_key]

    # Merge with original class_info_grade
    class_df['Matched_Name'] = match_df['Matched_Name']

    return pd.merge(class_df, rmp_df, left_on='Matched_Name', right_on=rmp_key, how='left'), match_df

    # Run fuzzy merge with improved logic
  class_info_grade_rmp, match_df = fuzzy_merge(class_info_grade, rmp_data, "Instructor", "Name", threshold=95)

  class_info_grade_rmp_filtered = class_info_grade_rmp[['Course Code', 'Course Description', "Course Title", 'Credits', 'prefix', 'Start', 'End', 'Instructor', 'Rating', 'mean', 'Term', 'Building', 'GenEd Requirements', 'Days', "Section", "Registration Code"]]

  return class_info_grade_rmp_filtered

# Schedule the function to run every hour
def run_hourly_update():
    """Runs the full data update process every hour."""
    class_info_grade_rmp_filtered = main()  # Fetch & process new data
    update_database(class_info_grade_rmp_filtered)  # Update SQLite DB
    print("✅ Hourly update complete!")


schedule.every(1).hours.do(run_hourly_update)

if __name__ == "__main__":
    print("⏳ Starting scheduled updates...")
    run_hourly_update()  # Run immediately on startup

    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute
