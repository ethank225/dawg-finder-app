import { NextResponse } from "next/server";
import Database from "better-sqlite3";

// Connect to SQLite database
const path = require("path");
const dbPath = "/Users/ethan/Desktop/dawgfinder/backend/data/all_data.db";
const db = new Database(dbPath, { fileMustExist: true });

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    }

    console.log("Searching for courses with Course Code:", query);

    // Prepare and execute SQL query
    const statement = db.prepare(`
      SELECT DISTINCT * FROM courses
      WHERE "index" LIKE ? AND "Activity Type" = ?
    `);
    const results = statement.all(`%${query}%`, "lecture");

    console.log(results)
    return NextResponse.json(results);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
