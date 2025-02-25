import { NextResponse } from "next/server"

// Example mock data (replace this later with a real database query)
const mockClasses = [
  {
    courseId: 142,
    courseDept: "CSE",
    name: "Computer Programming I",
    credits: 4,
    gpaAverage: 3.4,
    quarterOffered: "Autumn, Winter, Spring",
    creditSatisfied: "VLPA, QSR",
    professor: {
      name: "Stuart Reges",
      rating: 4.2,
    },
    schedule: {
      time: "10:30",
      days: "MWF",
      building: "CSE2",
    },
    description:
      "Basic programming-in-the-small abilities and concepts including procedural programming (methods, parameters, return values), basic control structures (sequence, if/else, for loop, while loop), file processing, arrays, and an introduction to defining classes.",
    sections: [
      {
        sln: "12345",
        section: "A",
        professor: "Stuart Reges",
        rating: 4.2,
        time: "10:30",
        days: "MWF",
        building: "CSE2",
        room: "G20",
        enrollmentCurrent: 45,
        enrollmentMax: 55,
      },
      {
        sln: "12346",
        section: "B",
        professor: "Brett Wortzman",
        rating: 4.5,
        time: "11:30",
        days: "MWF",
        building: "CSE2",
        room: "G10",
        enrollmentCurrent: 48,
        enrollmentMax: 55,
      },
      {
        sln: "12347",
        section: "C",
        professor: "Kevin Lin",
        rating: 4.7,
        time: "13:30",
        days: "TTh",
        building: "CSE2",
        room: "G20",
        enrollmentCurrent: 50,
        enrollmentMax: 55,
      },
    ],
  },
  {
    courseId: 143,
    courseDept: "CSE",
    name: "Computer Programming II",
    credits: 4,
    gpaAverage: 3.2,
    quarterOffered: "Autumn, Winter, Spring, Summer",
    creditSatisfied: "VLPA, QSR",
    professor: {
      name: "Brett Wortzman",
      rating: 4.5,
    },
    schedule: {
      time: "13:30",
      days: "TTh",
      building: "CSE2",
    },
    description:
      "Continuation of CSE142. Concepts of data abstraction and encapsulation including stacks, queues, linked lists, binary trees, recursion, instruction to complexity and use of predefined collection classes.",
    sections: [
      {
        sln: "12349",
        section: "A",
        professor: "Brett Wortzman",
        rating: 4.5,
        time: "13:30",
        days: "TTh",
        building: "CSE2",
        room: "G20",
        enrollmentCurrent: 42,
        enrollmentMax: 55,
      },
      {
        sln: "12350",
        section: "B",
        professor: "Kevin Lin",
        rating: 4.7,
        time: "15:30",
        days: "TTh",
        building: "CSE2",
        room: "G10",
        enrollmentCurrent: 38,
        enrollmentMax: 55,
      },
    ],
  },
]

// Always return mock data without filtering
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")
  console.log(query)
  return NextResponse.json(mockClasses)
}


//Chia's thing will get a list of clases and return it

//Need to look thorugh the database and get the classes that match the list that his spits back