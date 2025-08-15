import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";

export async function GET() {
  try {
    // Simple test query to check database connection
    const result = await db.execute('SELECT 1 as test');
    
    return NextResponse.json({ 
      status: "success", 
      message: "Database connection working",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}