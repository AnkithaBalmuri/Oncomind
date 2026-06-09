import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = [
  "/dashboard",
  "/chat",
  "/voice",
  "/documents",
  "/analyzer",
  "/research",
  "/trials",
  "/visit-prep",
  "/evaluation",
  "/admin",
  "/settings"
];

export function middleware(request: NextRequest) {
  const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  // Demo mode remains open so the portfolio build works without external auth keys.
  // In production, replace this with Clerk's clerkMiddleware/auth().protect().
  if (!clerkConfigured || !isProtected) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
