import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log('Hello from the server!');
  return NextResponse.json({ hello: "world" });
}