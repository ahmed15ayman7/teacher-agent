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
    [teacherId: string]: {
      name: string;
      lessonCount: number;
      DoneCount: number;
      absentCount: number;
      lateCount: number;
      totalLateDuration: number;
      earlyLeaveCount: number;
      totalEarlyLeaveDuration: number;
      didNotActivateSupervisionCount: number;
      waitingDone: number;
      waitingPaidDone: number;
      didNotSendWeeklyPlanCount: number;
      missedLessonCount: number;
      missedStandbyCount: number;
      enteredStandbyCount: number;
      lateForWorkCount: number;
      totalLateForWorkDuration: number;
      leftSchoolCount: number;
      TeacherWaitDone: string[];
      TeacherWaitPaidDone: string[];
    };
  },
  startDate: string,
  endDate: string
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("تقرير");

  // إعداد عرض الأعمدة وارتفاع الصفوف
  worksheet.columns = Array.from(
    { length: Object.keys(notes).length * 3 },
    () => ({
      width: 25, // عرض العمود
    })
  );

  worksheet.eachRow((row, rowNumber) => {
    row.height = 30; // ارتفاع الصف
  });

  // إعداد عنوان التقرير
  worksheet.mergeCells("A1:D1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `تقرير أداء المعلمين`;
  titleCell.font = { size: 20, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "4CAF50" },
  };

  // تاريخ البداية والنهاية
  worksheet.getCell("A2").value = "تاريخ البداية";
  worksheet.getCell("B2").value = startDate;
  worksheet.getCell("D2").value = "تاريخ النهاية";
  worksheet.getCell("E2").value = endDate;

  // إعداد الأعمدة
  let columnIndex = 1;

  Object.entries(notes).forEach(([teacherId, data], index) => {
    // إضافة اسم المعلم
    worksheet.mergeCells(3, columnIndex, 3, columnIndex + 1);
    const teacherTitleCell = worksheet.getCell(3, columnIndex);
    teacherTitleCell.value = `اسم المعلم: ${data.name}`;
    teacherTitleCell.font = {
      bold: true,
      size: 14,
      color: { argb: "FFFFFFFF" },
    };
    teacherTitleCell.alignment = { horizontal: "center" };
    teacherTitleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "007BFF" },
    };

    // رؤوس الجدول
    worksheet.getCell(4, columnIndex).value = "البيان";
    worksheet.getCell(4, columnIndex + 1).value = "القيمة";
    worksheet.getCell(4, columnIndex).font = { bold: true };
    worksheet.getCell(4, columnIndex + 1).font = { bold: true };
    worksheet.getCell(4, columnIndex).alignment = { horizontal: "center" };
    worksheet.getCell(4, columnIndex + 1).alignment = { horizontal: "center" };

    // البيانات الخاصة بالمعلم
    const teacherData = [
      { label: "عدد الدروس", value: data.lessonCount },
      { label: "عدد الإنجازات", value: data.DoneCount },
      { label: "عدد الغياب", value: data.absentCount },
      { label: "عدد التأخيرات", value: data.lateCount },
      { label: "إجمالي مدة التأخير", value: data.totalLateDuration },
      { label: "عدد المغادرات المبكرة", value: data.earlyLeaveCount },
      {
        label: "إجمالي مدة المغادرة المبكرة",
        value: data.totalEarlyLeaveDuration,
      },
      {
        label: "عدد مرات عدم تفعيل الإشراف",
        value: data.didNotActivateSupervisionCount,
      },
      { label: "عدد الإنجازات المنتظرة", value: data.waitingDone },
      { label: "عدد الإنجازات المدفوعة المنتظرة", value: data.waitingPaidDone },
      {
        label: "عدد مرات عدم إرسال الخطة الأسبوعية",
        value: data.didNotSendWeeklyPlanCount,
      },
      { label: "عدد الدروس الفائتة", value: data.missedLessonCount },
      {
        label: "عدد الفصول الاحتياطية الفائتة",
        value: data.missedStandbyCount,
      },
      {
        label: "عدد الفصول الاحتياطية التي دخلها",
        value: data.enteredStandbyCount,
      },
      { label: "عدد مرات التأخير عن العمل", value: data.lateForWorkCount },
      {
        label: "إجمالي مدة التأخير عن العمل",
        value: data.totalLateForWorkDuration,
      },
      { label: "عدد مرات ترك المدرسة", value: data.leftSchoolCount },
    ];

    teacherData.forEach((item, dataIndex) => {
      worksheet.getCell(5 + dataIndex, columnIndex).value = item.label;
      worksheet.getCell(5 + dataIndex, columnIndex + 1).value = item.value;
      worksheet.getCell(5 + dataIndex, columnIndex).alignment = {
        horizontal: "center",
      };
      worksheet.getCell(5 + dataIndex, columnIndex + 1).alignment = {
        horizontal: "center",
      };
    });

    // إضافة عمود فاصل بعد كل معلم (عدا الأخير)
    if (index < Object.entries(notes).length - 1) {
      worksheet.getColumn(columnIndex + 2).width = 1; // عرض صغير للعمود الفاصل
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 4) {
          // البدء من الصف الثالث
          const cell = row.getCell(columnIndex + 2);
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "4CAF50" }, // اللون الأخضر
          };
        }
      });
    }
    columnIndex += 3;
  });

  // حفظ الملف
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `تقرير_المعلمين.xlsx`;
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
    font: { bold: true, color: { argb: "000000" }, size: 14 },
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
    style: headerStyle,
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1e7569" },
    },
  }));

  // تعيين أنماط للرؤوس
  worksheet.getRow(0).eachCell((cell) => {
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

interface ITeacher2 {
  name: string;
  WeeklySchedule: { lessons: Lesson[] }[];
}

export const generateExcel = async (teachers: ITeacher2[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("الجدول العام");

  // الأيام وعدد الحصص
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  console.log(teachers);
  // إعداد رأس الجدول
  worksheet.mergeCells("A1:A2");
  worksheet.getCell("A1").value = "المعلم";
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" }, // اللون الأصفر
  };
  worksheet.getCell("A1").alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  let colIndex = 2;
  days.forEach((day) => {
    worksheet.mergeCells(1, colIndex, 1, colIndex + 7);
    const dayCell = worksheet.getCell(1, colIndex);
    dayCell.value = day;
    dayCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" }, // اللون الأصفر
    };
    dayCell.alignment = { vertical: "middle", horizontal: "center" };

    periods.forEach((period, index) => {
      const periodCell = worksheet.getCell(2, colIndex + index);
      periodCell.value = `${period}`;
      periodCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" }, // اللون الأصفر
      };
      periodCell.alignment = { vertical: "middle", horizontal: "center" };
    });

    colIndex += 8; // الانتقال للأيام التالية
  });

  // إدخال بيانات المعلمين والجداول
  let rowIndex = 3; // بدء الصفوف من بعد العناوين
  teachers.forEach((teacher, teacherIndex) => {
    const teacherRow = worksheet.getRow(rowIndex);
    worksheet.getCell(rowIndex, 1).value = teacher.name;

    // تطبيق الألوان بالتناوب لصفوف المدرسين
    const rowColor =
      teacherIndex % 3 === 0
        ? "e5fbe9"
        : teacherIndex % 3 === 1
        ? "fffce9"
        : "ecf8fd"; // أخضر فاتح، لبني، أصفر باهت
    teacherRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: rowColor },
      };
    });

    days.forEach((day, dayIndex) => {
      periods.forEach((period, periodIndex) => {
        const lesson = teacher.WeeklySchedule[0].lessons.find(
          (l) => getArabicDay(l.day) === day && l.period === period
        );
        worksheet.getCell(rowIndex, 2 + dayIndex * 8 + periodIndex).value =
          lesson ? lesson.title : "";
        worksheet.getCell(rowIndex, 2 + dayIndex * 8 + periodIndex).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowColor },
        };
      });
    });

    rowIndex++;
  });

  // تنسيق الجدول
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `الجدول العام.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
