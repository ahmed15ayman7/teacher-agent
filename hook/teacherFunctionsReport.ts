// teacherFunctions.ts

import axios from "axios";
import { toast } from "react-toastify";
import {
  getArabicDay,
  generateNoteDisplay,
  calculateStatistics,
} from "@/constants";
import { Lesson } from "@/lib/models/WeeklySchedule";

export const handleSelectTeacherHandlerReport = async (
  id: string,
  START_END_WEEK: { start: Date; end: Date },
  setSchedule: React.Dispatch<React.SetStateAction<any>>,
  setNotes: React.Dispatch<React.SetStateAction<any>>,
  setSelectedTeacher: React.Dispatch<React.SetStateAction<string>>
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
    const fetchedSchedule = response.data;
    setSchedule(fetchedSchedule);
    setSelectedTeacher(id);
    let teacherLessons: {
      [teacherId: string]: { lessons: Lesson[]; name: string };
    } = {};

    fetchedSchedule?.forEach(
      (item: { lessons: Lesson[]; teacher: { _id: string; name: string } }) => {
        let lessons = item.lessons;
        let teacherId = item.teacher._id; // Teacher's unique ID
        let teacherName = item.teacher.name;

        if (!teacherLessons[teacherId]) {
          teacherLessons[teacherId] = { lessons: [], name: teacherName };
        }

        teacherLessons[teacherId].lessons.push(...lessons);
      }
    );

    let teacherStatistics: {
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
    } = {};

    for (const [teacherId, { lessons, name }] of Object.entries(
      teacherLessons
    )) {
      teacherStatistics[teacherId] = {
        name,
        lessonCount: lessons.length,
        ...calculateStatistics(lessons),
      };
    }

    console.log(teacherStatistics); // This will include both the ID and name along with statistics

    setNotes(teacherStatistics);

    // fetchedSchedule?.lessons.forEach((lesson: any) => {
    //   const note = generateNoteDisplay(lesson.notes);
    //   const key = `${getArabicDay(lesson.day)}-${lesson.period}`;
    //   updatedNotes[key] = note;
    // });
  } catch (error) {
    toast.error("حدث خطأ في جلب بيانات المعلم");
    console.error("Error fetching schedule:", error);
  }
};
