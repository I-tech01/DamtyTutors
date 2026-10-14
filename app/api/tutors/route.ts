import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// 1. Handles new registrations from your onboarding multi-step form wizard
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("Damty-Tutor-Employee-Data-Tracker");
    
    const result = await db.collection("employees").insertOne(body);

    return NextResponse.json(
      { 
        success: true, 
        _id: result.insertedId.toString() 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json(
      { message: "Failed to persist tutor record object data" }, 
      { status: 500 }
    );
  }
}

// 2. 💡 THE HOME FIX: Pulls data from 'employees' to populate your "Meet Our Tutors" cards
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Damty-Tutor-Employee-Data-Tracker");

    // Change this from "tutors" to "employees" so it catches your onboarding datasets!
    const tutors = await db.collection("employees").find({}).toArray();

    return NextResponse.json(tutors, { status: 200 });
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch tutor profiles" }, 
      { status: 500 }
    );
  }
}
