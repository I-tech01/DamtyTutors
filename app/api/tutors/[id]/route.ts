import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Damty-Tutor-Employee-Data-Tracker");

    // Find the employee profile using the incoming User ID from the Navbar link
let tutor = await db.collection("employees").findOne({ userId: id });

    if (!tutor) {
      tutor = await db.collection("employees").findOne({ userId: new ObjectId(id) });
    }

    if (!tutor) {
      tutor = await db.collection("employees").findOne({ _id: new ObjectId(id) });
    }

    if (!tutor) {
      return NextResponse.json({ message: "Tutor employee profile not found" }, { status: 404 });
    }

    return NextResponse.json(tutor, { status: 200 });
  } catch (error) {
    console.error("Tutor fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
