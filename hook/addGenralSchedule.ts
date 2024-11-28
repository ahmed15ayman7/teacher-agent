import ExcelJS from "exceljs";
import { getTeacher, uploadGenralSc } from "@/lib/actions/user.action";
import { toast } from "react-toastify";

interface Lesson {
  period: number;
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday";
  title: string;
}

interface WeeklyScheduleDocument {
  teacher: string;
  isTemplate: boolean;
  lessons: Lesson[];
}

const arabicToEnglishDay = {
  الأحد: "Sunday",
  الاثنين: "Monday",
  الثلاثاء: "Tuesday",
  الأربعاء: "Wednesday",
  الخميس: "Thursday",
};

// رفع وتحليل ملف الإكسيل
export const addGenralScheduleExcel = async (file: File) => {
  const toastId = toast.loading("جاري اضافة الجدول العام");
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const worksheet = workbook.worksheets[0]; // افترض أن اسم الورقة هو "الجدول العام"
    const teachersData: WeeklyScheduleDocument[] = [];
    worksheet?.eachRow(async (row, rowIndex) => {
      if (rowIndex < 3) return; // تجاهل رأس الجدول (الصف الأول والثاني)

      const teacherName = row.getCell(2).value as string; // اسم المعلم في العمود الأول
      if (!teacherName) return;

      const lessons: Lesson[] = [];
      let teacherId: string | undefined;
      console.log(teacherName.trim());
      let e = await getTeacher(teacherName.trim());
      if (teacherId) {
        console.error(`المعلم ${teacherName} غير موجود في قاعدة البيانات.`);
        return;
      } else {
        teacherId = e?._id;
        row.eachCell((cell, colIndex) => {
          if (colIndex === 1) return; // العمود الأول مخصص للمعلم
          if (colIndex === 2) return; // العمود الأول مخصص للمعلم

          const value = cell.value as string;
          if (value) {
            // حساب اليوم والحصة بناءً على العمود
            const dayIndex = Math.floor((colIndex - 3) / 7); // كل 8 أعمدة تمثل يومًا
            const periodIndex = (colIndex - 3) % 7; // الحصة داخل اليوم
            const day = Object.values(arabicToEnglishDay)[dayIndex] as
              | "Sunday"
              | "Monday"
              | "Tuesday"
              | "Wednesday"
              | "Thursday";

            day &&
              value.split("\n").join("").trim().length > 0 &&
              lessons.push({
                day,
                period: periodIndex + 1,
                title: value.trim(),
              });
          }
        });

        // تكوين بيانات الجدول الأسبوعي
        teachersData.push({
          teacher: teacherId!,
          isTemplate: true,
          lessons,
        });
      }
    });

    // حفظ الجداول في قاعدة البيانات
    console.log(teachersData);
    await uploadGenralSc(teachersData);
    toast.update(toastId, {
      render: "تم اضافة الجدول بنجاح",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  } catch (error: any) {
    toast.update(toastId, {
      render: `فشل في الاضافه ${error?.message}`,
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};
