import getDb from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. Verify the person making the request is an authenticated admin
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (
      !session ||
      (session.user as typeof session.user & { role?: string }).role !== "admin"
    ) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    // 2. Read payload from the frontend request body stream
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email parameter is required." },
        { status: 400 }
      );
    }

    // 3. Connect to database
    const client = await getDb;
    const db = client.db("Damty-Tutor-Employee-Data-Tracker");

    // 4. Update the record in the 'employees' collection 
    // Adds "admin" to roles array and flips position metadata
    const result = await db.collection("employees").updateOne(
      { "contactInfo.email": email },
      { 
        $addToSet: { roles: "admin" }, // Adds cleanly avoiding duplicates
        $set: { position: "Admin Staff" } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Tutor employee record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Make-admin route error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
