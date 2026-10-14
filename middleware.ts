import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = new Set([
  "/auth/login",
  "/auth/signup",
  "/unauthorized" // Added to prevent infinite redirect loops if an employee hits /admin
]);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Allow public routes
  if (publicRoutes.has(pathname)) {
    return NextResponse.next();
  }

  // 2. Check for active session cookie
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. Restrict /admin routes to admins only
  if (pathname.startsWith("/admin")) {
    try {
      // Pass the entire original Cookie header instead of guessing the key name
      const res = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/session`, {
        headers: { 
          cookie: request.headers.get("cookie") || "" 
        },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      const session = await res.json();

      // Fix: Check the singular .role string match matching your Better Auth config
      if (!session?.user || session.user.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      console.error("Middleware session verification failed:", error);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};