require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

// CONFIGURATION: Set the target user details here
const TARGET_USER_EMAIL = "damtytutors@gmail.com"; 

async function makeAdmin() {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) throw new Error("MONGODB_URL is not defined in .env.local");

    await mongoose.connect(uri);
    const db = mongoose.connection.useDb("Damty-Tutor-Employee-Data-Tracker");

    // Update the specific user's role to admin
    const result = await db.collection("user").updateOne(
      { email: TARGET_USER_EMAIL }, 
      { $set: { role: "admin" } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ No user found with email: ${TARGET_USER_EMAIL}`);
    } else if (result.modifiedCount === 0) {
      console.log(`ℹ️ User ${TARGET_USER_EMAIL} is already an admin.`);
    } else {
      console.log(`✅ Successfully promoted ${TARGET_USER_EMAIL} to "admin".`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Error updating role:", err);
    process.exit(1);
  }
}

makeAdmin();
