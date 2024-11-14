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
    colors.push("#FF0000"); // red
  }
  if (notes.late?.isLate) {
    text.push("متأخر");
    colors.push("#FFA500"); // orange
    durations.push(notes.late.duration.toString());
  }
  if (notes.earlyLeave?.leftEarly) {
    text.push("خروج مبكر");
    colors.push("cyan"); // dark orange
    durations.push(notes.earlyLeave.remainingTime.toString());
  }
  if (notes.didNotSendWeeklyPlan) {
    text.push("لم يرسل خطة أسبوعية");
    colors.push("#e1e80d"); // pink
  }
  if (notes.missedLesson) {
    text.push("لم يحضر الدرس");
    colors.push("green"); // purple
  }
  if (notes.missedStandby) {
    text.push("Missed standby");
    colors.push("#FFD700"); // gold
  }
  if (notes.enteredStandby) {
    text.push("Entered standby");
    colors.push("#008000"); // green
  }
  if (notes.lateForWork) {
    text.push("Late for work");
    colors.push("#DC143C"); // crimson
  }
  if (notes.didNotActivateSupervision) {
    text.push("Did not activate supervision");
    colors.push("#1E90FF"); // blue
  }
  if (notes.leftSchool) {
    text.push("Left school");
    colors.push("#A52A2A"); // brown
  }

  return { text, colors, durations };
};

interface LessonNotes {
  absent?: boolean;
  note?: string;
  late?: { isLate: boolean; duration: number };
  earlyLeave?: { leftEarly: boolean; remainingTime: number };
  didNotSendWeeklyPlan?: boolean;
  missedLesson?: boolean;
}
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

export function generateLessonNotes(
  options: string[],
  duration: number = 0,
  duration2: number = 0
): LessonNotes {
  const notes: LessonNotes = {};

  options.forEach((option) => {
    switch (option) {
      case "غائب":
        notes.absent = true;
        break;
      case "متأخر":
        notes.late = { isLate: true, duration };
        break;
      case "خروج مبكر":
        notes.earlyLeave = { leftEarly: true, remainingTime: duration2 };
        break;
      case "لم يرسل خطة أسبوعية":
        notes.didNotSendWeeklyPlan = true;
        break;
      case "لم يحضر الدرس":
        notes.missedLesson = true;
        break;
      default:
        notes.note = option;
    }
  });

  return notes;
}
