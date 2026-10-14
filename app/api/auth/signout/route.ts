import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Signed out" });

  // Better Auth may prefix the session cookie when secure cookies are enabled.
  res.cookies.delete("better-auth.session_token");
  res.cookies.delete("__Secure-better-auth.session_token");

  return res;
}