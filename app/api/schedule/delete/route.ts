import Teacher from "@/lib/models/Teacher";
import WeeklySchedule from "@/lib/models/WeeklySchedule";
import { connectDB } from "@/mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    // الاتصال بقاعدة البيانات
    await connectDB();

    // استخراج `schoolId` من الطلب
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("schoolId");

    if (!schoolId) {
      return NextResponse.json(
        { message: "يرجى تقديم schoolId في الطلب" },
        { status: 400 }
      );
    }

    // الحصول على جميع المدرسين الذين ينتمون إلى schoolId
    const teachers = await Teacher.find({ schoolId }).select("_id");

    if (teachers.length === 0) {
      return NextResponse.json({
        message: "لم يتم العثور على مدرسين لهذا schoolId",
      });
    }

    // استخراج معرفات المدرسين
    const teacherIds = teachers.map((teacher) => teacher._id);

    // العثور على الجداول التي ستُحذف للحصول على معرفاتها
    const schedulesToDelete = await WeeklySchedule.find({
      isTemplate: true,
      teacher: { $in: teacherIds },
    }).select("_id");

    const scheduleIds = schedulesToDelete.map((schedule) => schedule._id);

    // حذف الجداول التي isTemplate = true والمرتبطة بالمدرسين
    const deleteResult = await WeeklySchedule.deleteMany({
      _id: { $in: scheduleIds },
    });

    // تحديث المدرسين لإزالة الإشارات إلى الجداول المحذوفة
    await Teacher.updateMany(
      { _id: { $in: teacherIds } },
      { $pull: { WeeklySchedule: { $in: scheduleIds } } }
    );

    return NextResponse.json({
      message: "تم حذف جميع الجداول التي isTemplate = true بنجاح",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء حذف الجداول" },
      { status: 500 }
    );
  }
}
