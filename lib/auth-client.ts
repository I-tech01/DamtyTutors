import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins"; // Import the companion client plugin

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    adminClient() // Register it here
  ]
});