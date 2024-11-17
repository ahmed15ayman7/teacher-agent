import { connectDB } from "@/mongoose";
import Teacher from "@/lib/models/Teacher";
import { NextResponse } from "next/server";
import School from "@/lib/models/school";
import WeeklySchedule from "@/lib/models/WeeklySchedule";

// استرجاع جميع المعلمين
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");
    const i = searchParams.get("i");
    const teachers =
      i === "1"
        ? await Teacher.find({ schoolId }).populate({
            path: "WeeklySchedule",
            model: WeeklySchedule,
            select: "lessons",
          })
        : await Teacher.find({ schoolId });
    return NextResponse.json(teachers);
  } catch (error: any) {
    return NextResponse.json({
      message: "خطأ في جلب المعلمين ",
      error: error.message,
    });
  }
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  try {
    const teacher = new Teacher(data);
    if (data.schoolId) {
      let school: { teachers: string[] } | null = await School.findById(
        data.schoolId
      );
      school?.teachers.push(data.schoolId);
    }
    await teacher.save();
    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  await connectDB();
  const { id, ...data } = await request.json();
  try {
    const teacher = await Teacher.findByIdAndUpdate(id, data, { new: true });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json(teacher);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// حذف معلم
export async function DELETE(request: Request) {
  await connectDB();
  const { id } = await request.json();
  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
