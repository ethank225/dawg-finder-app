import { NextResponse } from "next/server";

const mockSections = [
  {
    "Course Code": "CSE 142",
    "Course Description": "Introduction to programming.",
    "Course Title": "Computer Programming I",
    "Credits": "4",
    "prefix": "CSE",
    "Start": "10:30",
    "End": "11:20",
    "Instructor": "Stuart Reges",
    "Rating": 4.2,
    "Difficulty": 3.5,
    "mean": 3.6,
    "Term": "Autumn 2024",
    "Building": "CSE2",
    "GenEd Requirements": "NSc",
    "Days": "MWF",
    "Section": "AA",
    "Registration Code": 12345,
    "enrollCount": 150,
    "enrollMaximum": 200
  },
  {
    "Course Code": "CSE 142",
    "Course Description": "Introduction to programming.",
    "Course Title": "Computer Programming I",
    "Credits": "4",
    "prefix": "CSE",
    "Start": "11:30",
    "End": "12:20",
    "Instructor": "Brett Wortzman",
    "Rating": 4.5,
    "Difficulty": 3.5,
    "mean": 3.8,
    "Term": "Autumn 2024",
    "Building": "CSE2",
    "GenEd Requirements": "NSc",
    "Days": "MWF",
    "Section": "BA",
    "Registration Code": 12346,
    "enrollCount": 180,
    "enrollMaximum": 200,
    "myPlanLink": "https://course-app-api.planning.sis.uw.edu/api/courses/AFRAM%20150/details"
  },
  {
    "Course Code": "CSE 142",
    "Course Description": "Introduction to programming.",
    "Course Title": "Computer Programming I",
    "Credits": "4",
    "prefix": "CSE",
    "Start": "13:30",
    "End": "14:20",
    "Instructor": "Kevin Lin",
    "Rating": 4.7,
    "Difficulty": 3.5,
    "mean": 3.9,
    "Term": "Autumn 2024",
    "Building": "CSE2",
    "GenEd Requirements": "NSc",
    "Days": "TTh",
    "Section": "CA",
    "Registration Code": 12347,
    "enrollCount": 120,
    "enrollMaximum": 150,
    "myPlanLink": "https://course-app-api.planning.sis.uw.edu/api/courses/AFRAM%20150/details"
  }
];


export async function GET(req: Request) {
  console.log(req);

  return NextResponse.json(mockSections);
}
