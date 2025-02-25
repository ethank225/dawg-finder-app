import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // Get absolute path to Python script
    const scriptPath = path.join(process.cwd(), "backend", "updateDB.py");

    // Spawn Python script
    const pythonProcess = spawn("python3", [scriptPath]);

    // Capture standard output
    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python Output: ${data.toString()}`);
    });

    // Capture errors
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data.toString()}`);
    });

    // Handle process completion
    pythonProcess.on("close", (code) => {
      console.log(`Python script exited with code ${code}`);
    });

    return NextResponse.json({ success: true, message: "Script started running" });
  } catch (error) {
    console.error("Error starting Python script:", error);
    return NextResponse.json({ success: false, error: "Failed to start Python script" });
  }
}
