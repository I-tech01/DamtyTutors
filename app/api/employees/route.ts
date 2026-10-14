import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Employee } from "@/types/employee";
import { resend } from "@/lib/resend";

export async function GET() {
  const client = await connectDB;
  const db = client.db("Damty-Tutor-Employee-Data-Tracker");
  const employees = await db.collection<Employee>("employees").find().toArray();
  return NextResponse.json(employees);
}

export async function POST(req: NextRequest) {
  try {
    const client = await connectDB;
    // Explicitly connects to your custom tracker cluster namespace
    const db = client.db("Damty-Tutor-Employee-Data-Tracker");

    // 💡 Read the body payload as JSON string stream sent from your React wizard form
    const data = await req.json();

    // 💡 Build and map properties directly into your structural Employee object format
    const employee: Employee = {
      name: (data.tutorName as string) ?? "",
      contactInfo: {
        email: (data.email as string) ?? "", // Populated via session context or your form fields
      },
      education: {
        degree: (data.education as string) ?? "",
        institution: (data.institution as string) ?? "", // Storing the chosen dropdown option string
        graduationYear: Number(data.graduationYear ?? 0),
      },
      address: {
        street: (data.street as string) ?? "",
        city: (data.city as string) ?? "",
        state: (data.state as string) ?? "",
        zip: (data.zip as string) ?? "",
      },
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      experienceYears: Number(data.experienceYears ?? 0),
      // If subjects comes through as an array from the multi-step checkbox tags, save it directly
      subjects: Array.isArray(data.subjects) ? data.subjects : [],
      yearJoined: Number(data.joiningYear ?? new Date().getFullYear()),
      position: (data.position as string) ?? "Tutor",
      profilePictureUrl: (data.avatarUrl as string) ?? "", // Secure UploadThing pre-hosted URL
    };

    // Store properties that extend basic layouts (like operational logistics choice keys)
    // inside dynamic storage containers if your schema permits it
    const { _id: _employeeId, ...employeeWithoutId } = employee;
    const dbPayload = {
      ...employeeWithoutId,
      timeZone: data.timeZone ?? "GMT+1",
      weeklyCapacity: Number(data.weeklyCapacity ?? 10),
      bio: data.bio ?? "",
    };

    // Insert document record into MongoDB collection
    const result = await db.collection("employees").insertOne(dbPayload);

    // Fire confirmation email tracking alert via Resend
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "isaacadedokun111@gmail.com",
      subject: "New Tutor Joined",
      text: `A new tutor has joined: ${employee.name}\nEmail: ${employee.contactInfo.email}\nInstitution: ${employee.education.institution}\nDegree: ${employee.education.degree}\nGraduation Year: ${employee.education.graduationYear}\nYears Exp: ${employee.experienceYears}\nAddress: ${employee.address.street}, ${employee.address.city}\nProfile Picture: ${employee.profilePictureUrl}`,
    });

    return NextResponse.json({
      success: true,
      employee: dbPayload,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error inserting employee data record:", error);
    return NextResponse.json(
      { error: "Failed to add employee record profile details" },
      { status: 500 },
    );
  }
}
