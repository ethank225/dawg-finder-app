import { NextResponse } from "next/server";
import Database from "better-sqlite3";

// Connect to SQLite database
const path = require("path");
const dbPath = "/Users/ethan/Desktop/dawgfinder/backend/data/all_data.db";
const db = new Database(dbPath, { fileMustExist: true });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("courseId")?.replace(/\s/g, ""); // Remove all spaces
    const lectureId = query.slice(-1); // Extract the last character
    const updatedQuery = query.slice(0, -1); // Remove the last character

    console.log("Lecture ID:", lectureId);
    console.log("Updated Query:", updatedQuery);


    if (!lectureId) {
      return NextResponse.json({ error: "Invalid courseId" }, { status: 400 });
    }

    // Prepare and execute SQL query
    const statement = db.prepare(`
      SELECT DISTINCT * FROM courses
      WHERE "index" = ? AND substr("Section", 1, 1) = ? AND "Activity Type" = ?
    `);

    const results = statement.all(updatedQuery, lectureId, "quiz"); // Ensures first character of "Section" matches lectureId

    console.log("Results:", results);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




