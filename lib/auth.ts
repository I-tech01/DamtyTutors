import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins"; // 1. Import the Admin plugin
import clientPromise from "@/lib/mongodb";

const client = await clientPromise;
const db = client.db("Damty-Tutor-Employee-Data-Tracker");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }), 
  emailAndPassword: { enabled: true },
  
  // 2. Add the admin plugin to activate role recognition
  plugins: [
    admin() 
  ],

  // 3. Keep your database creation hooks intact
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role: "employee", // Default role for standard signups
            },
          };
        },
      },
    },
  },
});