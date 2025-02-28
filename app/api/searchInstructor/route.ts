import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Get the teacherId from the URL query parameter
  const url = new URL(req.url);
  const teacherId = url.searchParams.get('teacherId');

  console.log("Teacher ID received:", teacherId); // For debugging

  const mockCourses = [
    {
      code: "CS 101",
      name: "Introduction to Programming",
      rating: 4.5,
      quarters: ["Winter 2025"],
      myPlanLink: "https://course-app-api.planning.sis.uw.edu/api/courses/AFRAM%20150/details"
    },
    {
      code: "CS 142",
      name: "Computer Programming II",
      rating: 4.2,
      quarters: ["Spring 2025"],
      myPlanLink: "https://course-app-api.planning.sis.uw.edu/api/courses/AFRAM%20150/details"
    }
  ];

  return NextResponse.json(mockCourses);
}