import { NextResponse } from "next/server";
import WeeklySchedule, { Lesson } from "@/lib/models/WeeklySchedule"; // Adjust this path as needed
import { connectDB } from "@/mongoose";
import Teacher from "@/lib/models/Teacher";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { teacherId, weekStartDate, lesson } = await req.json();

    // Validate inputs
    if (!teacherId || !weekStartDate || !lesson) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    let weeklySchedule = await WeeklySchedule.findOne({
      teacher: teacherId,
      weekStartDate: new Date(weekStartDate),
    });
    if (!weeklySchedule) {
      weeklySchedule = new WeeklySchedule({
        teacher: teacherId,
        weekStartDate: new Date(weekStartDate),
        lessons: [lesson],
      });
      let t = await Teacher.findById(teacherId);
      t.WeeklySchedule.push(weeklySchedule._id);
      await t.save();
      if ((lesson as Lesson).notes.enteredStandby) {
        let weeklySchedule2 = await WeeklySchedule.findOne({
          teacher: (lesson as Lesson).notes.enteredStandby,
          weekStartDate: new Date(weekStartDate),
        });
        let notes = (lesson as Lesson).notes;
        let Les: Lesson = {
          notes: {
            ...notes,
            waitingDone: teacherId,
            enteredStandby: undefined,
          },
          period: (lesson as Lesson).period,
          day: (lesson as Lesson).day,
          title: "أنتظار",
        };
        if (!weeklySchedule2) {
          weeklySchedule2 = new WeeklySchedule({
            teacher: (lesson as Lesson).notes.enteredStandby,
            weekStartDate: new Date(weekStartDate),
            lessons: [Les],
          });
          let t = await Teacher.findById(
            (lesson as Lesson).notes.enteredStandby
          );
          t.WeeklySchedule.push(weeklySchedule2._id);
          await t.save();
        } else {
          let isLessonFind = weeklySchedule.lessons.some(
            (e) => e.day === Les.day && e.period === Les.period
          );

          if (isLessonFind) {
            // If the lesson exists, update it
            weeklySchedule2.lessons = weeklySchedule2.lessons.map((e) => {
              if (e.day === Les.day && e.period === Les.period) {
                // Update the existing lesson with the new lesson data
                return { ...e, ...Les }; // This will overwrite the existing lesson with the new one
              }
              return e; // Keep other lessons unchanged
            });
          } else {
            // If the lesson does not exist, add it
            weeklySchedule2.lessons.push(lesson);
          }
        }
        await weeklySchedule2.save();
      }
    } else {
      if ((lesson as Lesson).notes.enteredStandby) {
        let weeklySchedule2 = await WeeklySchedule.findOne({
          teacher: (lesson as Lesson).notes.enteredStandby,
          weekStartDate: new Date(weekStartDate),
        });
        let notes = (lesson as Lesson).notes;
        let Les: Lesson = {
          notes: {
            ...notes,
            waitingDone: teacherId,
            enteredStandby: undefined,
          },
          period: (lesson as Lesson).period,
          day: (lesson as Lesson).day,
          title: "أنتظار",
        };
        if (!weeklySchedule2) {
          weeklySchedule2 = new WeeklySchedule({
            teacher: (lesson as Lesson).notes.enteredStandby,
            weekStartDate: new Date(weekStartDate),
            lessons: [Les],
          });
        } else {
          let isLessonFind = weeklySchedule.lessons.some(
            (e) => e.day === Les.day && e.period === Les.period
          );

          if (isLessonFind) {
            // If the lesson exists, update it
            weeklySchedule2.lessons = weeklySchedule2.lessons.map((e) => {
              if (e.day === Les.day && e.period === Les.period) {
                // Update the existing lesson with the new lesson data
                return { ...e, ...Les }; // This will overwrite the existing lesson with the new one
              }
              return e; // Keep other lessons unchanged
            });
          } else {
            // If the lesson does not exist, add it
            weeklySchedule2.lessons.push(lesson);
          }
        }
        await weeklySchedule2.save();
      }
      let isLessonFind = weeklySchedule.lessons.some(
        (e) => e.day === lesson.day && e.period === lesson.period
      );

      if (isLessonFind) {
        // If the lesson exists, update it
        weeklySchedule.lessons = weeklySchedule.lessons.map((e) => {
          if (e.day === lesson.day && e.period === lesson.period) {
            // Update the existing lesson with the new lesson data
            return { ...e, ...lesson }; // This will overwrite the existing lesson with the new one
          }
          return e; // Keep other lessons unchanged
        });
      } else {
        // If the lesson does not exist, add it
        weeklySchedule.lessons.push(lesson);
      }
    }

    // Save the updated or new schedule
    await weeklySchedule.save();

    return NextResponse.json(
      {
        message: "Lesson added successfully",
        weeklySchedule,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding lesson:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
