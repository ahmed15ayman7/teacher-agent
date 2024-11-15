import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; // Import jwtVerify from jose

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authTokenSchool")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "default_secret")
    );
    if (!payload) {
      // console.log('Unauthorized Access: Role is not admin', payload.role); // Log the role
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    // console.error('Token verification failed:', error); // Log the error
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/support-forms",
    "/teacher-info",
    "/add-notes",
    "/add-teacher",
    "/general-schedule",
    "/prepare-program",
    "/send-reports",
  ],
};
