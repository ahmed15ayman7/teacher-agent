import HijriDate from "hijri-date";
import { Lesson } from "@/lib/models/WeeklySchedule";
import ExcelJS from "exceljs";
export type notesTypy =
  | "name"
  | "lessonCount"
  | "DoneCount"
  | "absentCount"
  | "lateCount"
  | "totalLateDuration"
  | "earlyLeaveCount"
  | "totalEarlyLeaveDuration"
  | "didNotActivateSupervisionCount"
  | "waitingDone"
  | "didNotSendWeeklyPlanCount"
  | "missedLessonCount"
  | "missedStandbyCount"
  | "enteredStandbyCount"
  | "lateForWorkCount"
  | "totalLateForWorkDuration"
  | "leftSchoolCount"
  | "TeacherWaitDone"
  | "TeacherWaitPaidDone";

// دالة لفصل الأسماء في حالة وجود أكثر من اسم
const splitNames = (names: string) => {
  return names.split(",").map((name) => name.trim());
};

export const exportToExcel = async (
  notes: {
    [teacherName: string]: {
      lateCount: number;
      totalLateDuration: number;
      earlyLeaveCount: number;
      totalEarlyLeaveDuration: number;
      absentCount: number;
      didNotSendWeeklyPlanCount: number;
      missedLessonCount: number;
      missedStandbyCount: number;
      enteredStandbyCount: number;
      lateForWorkCount: number;
      totalLateForWorkDuration: number;
      didNotActivateSupervisionCount: number;
      leftSchoolCount: number;
    };
  },
  teacherName: string,
  startDate: string,
  endDate: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("تقرير");

  // إعداد عنوان التقرير مع استخدام نمط تعبئة "pattern"
  worksheet.mergeCells("A1:C1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `تقرير أداء المعلم`;
  titleCell.font = { size: 20, bold: true, color: { argb: "FFFFFFFF" } };

  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "4CAF50" }, // اللون الأخضر
  };

  worksheet.getCell("B22").value = "تاريخ البداية";
  worksheet.getCell("B23").value = startDate;
  worksheet.getCell("C22").value = "تاريخ النهاية";
  worksheet.getCell("C23").value = endDate;
  worksheet.getCell("B22").font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getCell("B22").alignment = { horizontal: "center" };
  worksheet.getCell("B22").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "007BFF" }, // اللون الأزرق
  };
  worksheet.getCell("C22").font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getCell("C22").alignment = { horizontal: "center" };
  worksheet.getCell("C22").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "007BFF" }, // اللون الأزرق
  };
  // إضافة معلومات المعلم
  const teacherNames = splitNames(teacherName); // فصل الأسماء إذا كانت هناك أكثر من اسم
  if (teacherNames.length === 1) {
    worksheet.getCell("A3").value = "اسم المعلم";
    worksheet.getCell("A4").value = teacherNames[0];
  } else {
    worksheet.getCell("A3").value = "أسماء المعلمين";
    teacherNames.forEach((name, index) => {
      worksheet.getCell(`A${4 + index}`).value = name;
    });
  }
  worksheet.getCell("A3").font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getCell("A3").alignment = { horizontal: "center" };
  worksheet.getCell("A3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "4CAF50" }, // اللون الأزرق
  };
  // إضافة رؤوس الجدول
  worksheet.getCell("B3").value = "البيان";
  worksheet.getCell("C3").value = "القيمة";
  worksheet.getCell("C3").font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getCell("B3").font = { bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getCell("B3").alignment = { horizontal: "center" };
  worksheet.getCell("C3").alignment = { horizontal: "center" };
  worksheet.getCell("B3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "007BFF" }, // اللون الأزرق
  };
  worksheet.getCell("C3").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "007BFF" }, // اللون الأزرق
  };

  // إضافة بيانات الملاحظات
  let rowIndex = 5;
  Object.entries(notes).forEach(([key, value]) => {
    worksheet.getCell(`B${rowIndex}`).value = getLabel(key as notesTypy);
    worksheet.getCell(`C${rowIndex}`).value = `${value}`;
    worksheet.getCell(`B${rowIndex}`).alignment = { horizontal: "center" };
    worksheet.getCell(`C${rowIndex}`).alignment = { horizontal: "center" };

    // إضافة حدود للخلايا
    worksheet.getCell(`B${rowIndex}`).border = {
      top: { style: "thin", color: { argb: "CCCCCC" } },
      left: { style: "thin", color: { argb: "CCCCCC" } },
      bottom: { style: "thin", color: { argb: "CCCCCC" } },
      right: { style: "thin", color: { argb: "CCCCCC" } },
    };
    worksheet.getCell(`C${rowIndex}`).border = {
      top: { style: "thin", color: { argb: "CCCCCC" } },
      left: { style: "thin", color: { argb: "CCCCCC" } },
      bottom: { style: "thin", color: { argb: "CCCCCC" } },
      right: { style: "thin", color: { argb: "CCCCCC" } },
    };

    // تغيير اللون الخلفي لكل سطر
    if (rowIndex % 2 === 0) {
      worksheet.getCell(`B${rowIndex}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F2F2F2" }, // خلفية رمادي فاتح للصفوف الزوجية
      };
      worksheet.getCell(`C${rowIndex}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "F2F2F2" }, // خلفية رمادي فاتح للصفوف الزوجية
      };
    }

    rowIndex++;
  });

  // تعديل عرض الأعمدة
  worksheet.getColumn(1).width = 30;
  worksheet.getColumn(2).width = 30; // توسيع عمود البيانات
  worksheet.getColumn(3).width = 15; // توسيع عمود القيم

  // حفظ الملف
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${teacherNames[0].slice(0, 50)}_تقرير_الأسبوع.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const buttonStyles =
  "w-full py-2 my-2 text-white font-bold rounded-lg bg-gradient-to-r from-green-700 to-blue-900 hover:from-green-800 hover:to-blue-800 shadow-md shadow-blue-500/50";

export const getNoteColor = (note: string) => {
  switch (note) {
    case "غائب":
      return "red";
    case "متأخر":
      return "orange";
    case "خروج مبكر":
      return "cyan";
    case "لم يرسل خطة أسبوعية":
      return "#e1e80d";
    case "لم يحضر الدرس":
      return "green";
    case "لم يدخل الانتظار":
      return "#FFD700"; // gold
    case "دخل الانتظار عن":
      return "#078199"; // teal
    case "متأخر عن الدوام":
      return "#AA14DC"; // crimson
    case "لم يفعل الإشراف":
      return "#1E90FF"; // blue
    case "خروج من المدرسة":
      return "#D25656"; // brown
    default:
      return "";
  }
};

export const generateNoteDisplay = (notes: Lesson["notes"]) => {
  const text: string[] = [];
  const colors: string[] = [];
  const durations: string[] = [];

  if (notes.absent) {
    text.push("غائب");
    colors.push("red");
  }
  if (notes.late?.isLate) {
    text.push("متأخر");
    colors.push("orange");
    durations.push(notes.late.duration.toString());
  }
  if (notes.earlyLeave?.leftEarly) {
    text.push("خروج مبكر");
    colors.push("cyan");
    durations.push(notes.earlyLeave.remainingTime.toString());
  }
  if (notes.didNotSendWeeklyPlan) {
    text.push("لم يرسل خطة أسبوعية");
    colors.push("#e1e80d");
  }
  if (notes.missedLesson) {
    text.push("لم يحضر الدرس");
    colors.push("green");
  }
  if (notes.missedStandby) {
    text.push("لم يدخل الانتظار");
    colors.push("#F0C907FF"); // gold
  }
  if (notes.enteredStandby) {
    text.push("دخل الانتظار عن");
    colors.push("#078199"); // teal
  }
  if (notes.waitingDone) {
    text.push("الانتظار");
    colors.push("#F1FD03FF"); // teal
  }
  if (notes.lateForWork?.isLate) {
    text.push("متأخر عن الدوام");
    colors.push("#AA14DC"); // crimson
    durations.push(notes.lateForWork.duration.toString());
  }
  if (notes.didNotActivateSupervision) {
    text.push("لم يفعل الإشراف");
    colors.push("#1E90FF"); // blue
  }
  if (notes.leftSchool) {
    text.push("خروج من المدرسة");
    colors.push("#D25656"); // brown
  }
  if (notes.note) {
    text.push(`${notes.note}`);
    colors.push("blue"); // blue
  }

  return { text, colors, durations };
};

export function getEnglishDay(
  arabicDay: "الأحد" | "الاثنين" | "الثلاثاء" | "الأربعاء" | "الخميس"
) {
  const dayMapping = {
    الأحد: "Sunday",
    الاثنين: "Monday",
    الثلاثاء: "Tuesday",
    الأربعاء: "Wednesday",
    الخميس: "Thursday",
  };

  return dayMapping[arabicDay] || "Invalid day";
}
export function getArabicDay(
  EnDay: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday"
) {
  const dayMapping = {
    Sunday: "الأحد",
    Monday: "الاثنين",
    Tuesday: "الثلاثاء",
    Wednesday: "الأربعاء",
    Thursday: "الخميس",
  };

  return dayMapping[EnDay] || "Invalid day";
}

interface CombinedNotesAndStatus {
  // LessonNotes properties
  absent?: boolean;
  note?: string;
  late?: { isLate: boolean; duration: number };
  earlyLeave?: { leftEarly: boolean; remainingTime: number };
  didNotSendWeeklyPlan?: boolean;
  missedLesson?: boolean;

  // StatusObject properties
  missedStandby?: boolean;
  enteredStandby?: string;
  lateForWork?: { isLate: boolean; duration: number };
  didNotActivateSupervision?: boolean;
  leftSchool?: boolean;
}

export function generateCombinedNotesAndStatus(
  options: string[],
  TID: string,
  duration: number = 0,
  duration2: number = 0,
  duration3: number = 0
): CombinedNotesAndStatus {
  const combined: CombinedNotesAndStatus = {};

  options.forEach((option) => {
    switch (option) {
      // LessonNotes cases
      case "غائب":
        combined.absent = true;
        break;
      case "متأخر":
        combined.late = duration ? { isLate: true, duration } : undefined;
        break;
      case "خروج مبكر":
        combined.earlyLeave = duration2
          ? { leftEarly: true, remainingTime: duration2 }
          : undefined;
        break;
      case "لم يرسل خطة أسبوعية":
        combined.didNotSendWeeklyPlan = true;
        break;
      case "لم يحضر الدرس":
        combined.missedLesson = true;
        break;

      // StatusObject cases
      case "لم يدخل الانتظار":
        combined.missedStandby = true;
        break;
      case "دخل الانتظار عن":
        combined.enteredStandby = TID || undefined;
        break;
      case "متأخر عن الدوام":
        combined.lateForWork = duration3
          ? { isLate: true, duration: duration3 }
          : undefined;
        break;
      case "لم يفعل الإشراف":
        combined.didNotActivateSupervision = true;
        break;
      case "خروج من المدرسة":
        combined.leftSchool = true;
        break;

      // Default case for any other notes
      default:
        if (!combined.note) {
          combined.note = option;
        }
        break;
    }
  });

  return combined;
}

type StatusObject = {
  missedStandby?: boolean;
  enteredStandby?: string;
  lateForWork?: { isLate: boolean; duration: number };
  didNotActivateSupervision?: boolean;
  leftSchool?: boolean;
};

export function mapStatusToOptions(status: StatusObject): string[] {
  const options: string[] = [];

  if (status.missedStandby) {
    options.push("لم يدخل الانتظار");
  }
  if (status.enteredStandby) {
    options.push("دخل الانتظار عن");
  }
  if (status.lateForWork?.isLate) {
    options.push("متأخر عن الدوام");
  }
  if (status.didNotActivateSupervision) {
    options.push("لم يفعل الإشراف");
  }
  if (status.leftSchool) {
    options.push("خروج من المدرسة");
  }

  return options;
}

export function calculateStatistics(lessons: Lesson[]) {
  // Initialize counters
  let lateCount = 0;
  let totalLateDuration = 0;
  let earlyLeaveCount = 0;
  let totalEarlyLeaveDuration = 0;
  let absentCount = 0;
  let didNotSendWeeklyPlanCount = 0;
  let missedLessonCount = 0;
  let missedStandbyCount = 0;
  let enteredStandbyCount = 0;
  let lateForWorkCount = 0;
  let totalLateForWorkDuration = 0;
  let didNotActivateSupervisionCount = 0;
  let leftSchoolCount = 0;
  let TeacherWaitPaidDone = [];
  let TeacherWaitDone = [];

  // Iterate through each lesson to count occurrences and sum durations
  for (const lesson of lessons) {
    const notes = lesson.notes;

    if (notes.late?.isLate) {
      lateCount++;
      totalLateDuration += notes.late.duration;
    }

    if (notes.earlyLeave?.leftEarly) {
      earlyLeaveCount++;
      totalEarlyLeaveDuration += notes.earlyLeave.remainingTime;
    }

    if (notes.absent) {
      absentCount++;
    }

    if (notes.didNotSendWeeklyPlan) {
      didNotSendWeeklyPlanCount++;
    }

    if (notes.missedLesson) {
      missedLessonCount++;
    }

    if (notes.missedStandby) {
      missedStandbyCount++;
    }

    if (notes.enteredStandby) {
      enteredStandbyCount++;
      TeacherWaitDone.push(notes.enteredStandby.toString());
    }
    if (notes.waitingDone) {
      TeacherWaitPaidDone.push(notes.waitingDone.toString());
    }

    if (notes.lateForWork?.isLate) {
      lateForWorkCount++;
      totalLateForWorkDuration += notes.lateForWork.duration;
    }

    if (notes.didNotActivateSupervision) {
      didNotActivateSupervisionCount++;
    }

    if (notes.leftSchool) {
      leftSchoolCount++;
    }
  }

  // Return an object with the calculated statistics
  return {
    lateCount,
    totalLateDuration,
    earlyLeaveCount,
    totalEarlyLeaveDuration,
    absentCount,
    didNotSendWeeklyPlanCount,
    missedLessonCount,
    missedStandbyCount,
    enteredStandbyCount,
    lateForWorkCount,
    totalLateForWorkDuration,
    didNotActivateSupervisionCount,
    leftSchoolCount,
    DoneCount: lessons.length - absentCount,
    TeacherWaitDone,
    TeacherWaitPaidDone,
    waitingDone: TeacherWaitPaidDone.length,
  };
}

export function getLabel(key: notesTypy) {
  const labels = {
    name: "إسم المعلم ",
    lessonCount: " عدد الحصص",
    DoneCount: "حصص أداها",
    absentCount: "حصص غاب عنها ",
    lateCount: "حصص تأخر عنها",
    totalLateDuration: "مجموع  التأخير عن الحصص (د) ",
    earlyLeaveCount: "خروج مبكر من الحصص",
    totalEarlyLeaveDuration: "  مجموع مدة الخروج المبكر (د)",
    didNotActivateSupervisionCount: " عدم تفعيل الإشراف",
    waitingDone: "اداء الانتظار",
    didNotSendWeeklyPlanCount: " عدم إرسال الخطة ",
    missedLessonCount: " الحصص التي لم يحضرها",
    missedStandbyCount: "حصص انتظار اديت عنه",
    enteredStandbyCount: " الحصص الاحتياطية التي دخلها",
    lateForWorkCount: " التأخر عن الدوام",
    totalLateForWorkDuration: "   مجموع التأخر عن الدوام (د)",
    leftSchoolCount: " المغادرة من المدرسة",
    TeacherWaitDone: "المعلمون الذين أدوا عنك الانتظار",
    TeacherWaitPaidDone: "المعلمون الذين أديت عنهم الانتظار",
  };

  return labels[key] || key;
}

export function getTime(): string {
  const now = new Date();

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Format time to HH:mm:ss
  const formattedTime = `${pad(hours)}:${pad(minutes)}`;

  return formattedTime;
}

// Helper function to pad single-digit numbers with a leading zero
function pad(num: number): string {
  return num.toString().padStart(2, "0");
}

export function getDate(): string {
  const now = new Date();

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1); // Months are zero-indexed
  const year = now.getFullYear();

  // Format date as DD/MM/YYYY
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
export function getHijriDate(): string {
  const hijriDate = new HijriDate();

  const day = hijriDate.getDate();
  const month = hijriDate.getMonth() + 1; // الأشهر تبدأ من 0
  const year = hijriDate.getFullYear();

  // تنسيق التاريخ الهجري
  return `${day}/${month}/${year}`;
}

import { ITeacher } from "@/lib/models/Teacher";

export const downloadTeachersExcel = async (
  teachers: ITeacher[],
  schoolData: {
    schoolName: string;
    principalName: string;
    educationalSupervisor: string;
  }
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("بيانات المدرسة والمعلمين");

  // إعداد الأنماط
  const headerStyle = {
    font: { bold: true, color: { argb: "FFFFFF" }, size: 14 },
    alignment: {
      vertical: "middle" as "middle",
      horizontal: "center" as "center",
    },
  };

  const subHeaderStyle = {
    font: { bold: true, color: { argb: "FFFFFF" }, size: 12 },
    alignment: {
      vertical: "middle" as "middle",
      horizontal: "center" as "center",
    },
  };

  const cellStyle = {
    alignment: {
      vertical: "middle" as "middle",
      horizontal: "center" as "center",
    },
  };
  let tLen = teachers.length;
  // إضافة بيانات المدرسة

  // إضافة رؤوس الأعمدة
  const headers = [
    "الاسم",
    "التخصص",
    "رقم السجل المدني",
    "عدد الجلسات",
    "رقم الهاتف",
    "مرحلة التدريس",
    "تاريخ الميلاد",
    "يوم الإشراف",
    "المؤهل",
    "مواد التدريس",
    "البريد الإلكتروني",
    "مهام أخرى",
    "مكان الإشراف",
    "الفصول التي يتم تدريسها",
    "الجدول الأسبوعي",
  ];

  worksheet.columns = headers.map((header, index) => ({
    header,
    key: `col${index}`,
    width: 20,
  }));

  // تعيين أنماط للرؤوس
  worksheet.getRow(2).eachCell((cell) => {
    cell.style = headerStyle;
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1e7569" },
    };
  });

  // إضافة بيانات المعلمين
  teachers.forEach((teacher, index) => {
    const row = worksheet.addRow([
      teacher.name,
      teacher.specialization,
      teacher.civilRecord,
      teacher.sessionCount,
      teacher.phoneNumber,
      teacher.teachingStage,
      teacher.birthDate
        ? new Date(teacher.birthDate).toLocaleDateString("ar-EG")
        : "",
      teacher.supervisionDay,
      teacher.qualification,
      teacher.TeachingMaterials,
      teacher.CorrespondenceEmail,
      teacher.OtherTasksAssigned,
      teacher.SupervisionPlace,
      teacher.ClassesTaught,
      teacher.WeeklySchedule,
    ]);

    // استخدام لون مختلف لكل صف
    const rowColor = index % 2 === 0 ? "DFF0D8" : "FFFFFF";
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowColor },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.style = cellStyle;
    });
  });
  worksheet.mergeCells(`A${tLen + 6}:B${tLen + 6}`);
  worksheet.getCell(
    `A${tLen + 6}`
  ).value = `بيانات المدرسة: ${schoolData.schoolName}`;
  worksheet.getCell(`A${tLen + 6}`).style = subHeaderStyle;
  worksheet.getCell(`A${tLen + 6}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1e7569" },
  };

  worksheet.mergeCells(`C${tLen + 6}:D${tLen + 6}`);
  worksheet.getCell(
    `C${tLen + 6}`
  ).value = `اسم المدير: ${schoolData.principalName}`;
  worksheet.getCell(`C${tLen + 6}`).style = subHeaderStyle;
  worksheet.getCell(`C${tLen + 6}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1e7569" },
  };

  worksheet.mergeCells(`E${tLen + 6}:F${tLen + 6}`);
  worksheet.getCell(
    `E${tLen + 6}`
  ).value = `وكيل الشؤون التعليمية: ${schoolData.educationalSupervisor}`;
  worksheet.getCell(`E${tLen + 6}`).style = subHeaderStyle;
  worksheet.getCell(`E${tLen + 6}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1e7569" },
  };

  worksheet.mergeCells(`G${tLen + 6}:H${tLen + 6}`);
  worksheet.getCell(
    `G${tLen + 6}`
  ).value = `تاريخ اليوم: ${new Date().toLocaleDateString("ar-EG")}`;
  worksheet.getCell(`G${tLen + 6}`).style = subHeaderStyle;
  worksheet.getCell(`G${tLen + 6}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "1e7569" },
  };

  worksheet.addRow([]); // سطر فارغ للفصل بين البيانات والمدرسين

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${schoolData.schoolName}_بيانات_المعلمين.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
