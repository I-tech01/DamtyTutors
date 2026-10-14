require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function run() {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) throw new Error("MONGODB_URL is not defined in .env.local");

    await mongoose.connect(uri);

    // Explicitly use the right database
    const db = mongoose.connection.useDb("Damty-Tutor-Employee-Data-Tracker");

    // Clean, robust query targeting the singular 'role' field used by Better Auth
    const result = await db.collection("user").updateMany(
      {
        $or: [
          { role: { $exists: false } },
          { role: null },
          { role: "" },
          { role: { $nin: ["admin", "employee"] } }
        ]
      },
      { $set: { role: "employee" } }, // Sets standard string role
    );

    console.log(
      `Matched ${result.matchedCount} and updated ${result.modifiedCount} users with default role "employee".`,
    );
    process.exit(0);
  } catch (err) {
    console.error("Error updating roles:", err);
    process.exit(1);
  }
}

run();