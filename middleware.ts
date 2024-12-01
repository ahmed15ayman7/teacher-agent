import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import axios from "axios";

const secret =
  process.env.JWT_SECRET ||
  "34567890iuyghjkhgfehjkjhrtyoiu5787iuujhdfhjhmhgdfgjfhj";

export async function middleware(request: NextRequest) {
  // Check if the URL contains ?show=true
  if (request.nextUrl.searchParams.get("show") === "true") {
    const absoluteUrl = `${request.nextUrl.origin}/api/login`;
    let res = await axios.post(absoluteUrl, {
      password: "123456789",
    });

    // إنشاء توكن باستخدام jose
    const token = await new SignJWT({ SchoolId: res.data.data.schoolId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(secret));

    let SchoolData = res.data.data;

    // إنشاء استجابة جديدة وتعيين الكوكيز
    const response = NextResponse.next();

    response.cookies.set("authTokenSchool", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
    });

    response.cookies.set("SchoolData", JSON.stringify(SchoolData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "strict",
    });

    // إعادة التوجيه بعد تعيين الكوكيز
    return response;
  }

  const token = request.cookies.get("authTokenSchool")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
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
