import { Lesson } from "@/lib/models/WeeklySchedule";

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
    colors.push("#FFD700"); // gold
  }
  if (notes.enteredStandby) {
    text.push("دخل الانتظار عن");
    colors.push("#078199"); // teal
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
