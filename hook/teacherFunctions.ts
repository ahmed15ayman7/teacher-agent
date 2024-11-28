// teacherFunctions.ts

import axios from "axios";
import { toast } from "react-toastify";
import { getArabicDay, generateNoteDisplay } from "@/constants";
import { Lesson, WeeklyScheduleDocument } from "@/lib/models/WeeklySchedule";

export const handleSelectTeacherHandler = async (
  id: string,
  START_END_WEEK: { start: Date; end: Date },
  setSchedule: React.Dispatch<React.SetStateAction<any>>,
  setNotes: React.Dispatch<React.SetStateAction<any>>,
  setTeachers: React.Dispatch<React.SetStateAction<any>>,
  setSelectedTeacher: React.Dispatch<React.SetStateAction<string>>,
  setScheduleTemplate: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const start = START_END_WEEK.start.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const end = START_END_WEEK.end.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const response = await axios.get(
      `/api/schedule?TeacherId=${id}&&start=${start}&&end=${end}`
    );
    let sc: { lessons: Lesson[] }[] = [];
    console.log(response);
    response.data?.map((e: WeeklyScheduleDocument) => {
      if (e?.isTemplate === true) {
        setScheduleTemplate(e);
      } else {
        setSchedule(e);
        sc.push(e);
      }
    });
    setSelectedTeacher(id);

    const updatedNotes: {
      [key: string]: {
        text: string[];
        colors: string[];
        durations?: string[];
      };
    } = {};
    sc[0]?.lessons.forEach((lesson: Lesson) => {
      console.log(lesson.notes);
      const note = generateNoteDisplay(lesson.notes);
      console.log(note);
      const key = `${getArabicDay(lesson.day)}-${lesson.period}`;
      updatedNotes[key] = note;
    });

    setNotes(updatedNotes);
  } catch (error) {
    toast.error("حدث خطأ في جلب بيانات المعلم");
    console.error("Error fetching schedule:", error);
  }
};
