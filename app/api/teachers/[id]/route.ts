// /api/teachers/[id]
import { connectDB } from "@/mongoose";
import Teacher from "@/lib/models/Teacher";
import WeeklySchedule from "@/lib/models/WeeklySchedule";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  try {
    const teacher = await Teacher.findById(params.id);

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch teacher data" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // الاتصال بقاعدة البيانات
    await connectDB();

    const teacherId = params.id;

    // العثور على المعلم للتحقق من وجوده
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return NextResponse.json(
        { message: "المعلم غير موجود" },
        { status: 404 }
      );
    }

    // حذف الجداول المرتبطة بالمعلم
    await WeeklySchedule.deleteMany({ teacher: teacher._id });

    // حذف المعلم
    await Teacher.findByIdAndDelete(teacherId);

    return NextResponse.json({
      message: "تم حذف المعلم والجداول المرتبطة به بنجاح",
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء حذف المعلم" },
      { status: 500 }
    );
  }
}
