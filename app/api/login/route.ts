import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/mongoose";
import School from "@/lib/models/school";

// استخدام متغير بيئي للـ JWT_SECRET مع تعيين قيمة افتراضية للأمان
const secret =
  process.env.JWT_SECRET ||
  "34567890iuyghjkhgfehjkjhrtyoiu5787iuujhdfhjhmhgdfgjfhj"; // غيّر القيمة الافتراضية في .env

export async function POST(request: Request) {
  try {
    await connectDB(); // تأكيد الاتصال بقاعدة البيانات

    const { password } = await request.json();

    // التحقق من إدخال البريد الإلكتروني وكلمة المرور
    if (!password) {
      return NextResponse.json({ message: "كلمة السر خاطئة" }, { status: 400 });
    }

    const SchoolData = await School.findOne({ password });

    if (!SchoolData) {
      return NextResponse.json({ message: "كلمة السر خاطئة" }, { status: 401 });
    }

    // توليد الـ JWT مع إعدادات الأمان مثل التوقيع ومدة الصلاحية
    const token = jwt.sign(
      { SchoolId: SchoolData._id }, // إضافة role هنا
      secret,
      { expiresIn: "30d" } // جعل مدة الصلاحية 30 يومًا (تعدل حسب المطلوب)
    );

    // إنشاء استجابة تسجيل دخول ناجحة
    const response = NextResponse.json(
      { message: "Login successful.", data: SchoolData },
      { status: 200 }
    );
    response.cookies.set("authTokenSchool", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // استخدم الـ https في الإنتاج
      maxAge: 60 * 60 * 24 * 30, // الكوكيز تنتهي بعد 30 يومًا
      sameSite: "strict", // لحماية الكوكيز من هجمات CSRF
    });
    // تخزين بيانات المستخدم في الكوكيز
    response.cookies.set("SchoolData", JSON.stringify(SchoolData), {
      httpOnly: false, // يمكن الوصول إلى الكوكيز من جانب العميل
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // تنتهي الكوكيز بعد 30 يومًا
      sameSite: "strict",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error.message);

    return NextResponse.json(
      {
        message: "An error occurred while processing your request.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
