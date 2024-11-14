import { NextResponse } from "next/server";
import WeeklySchedule from "@/lib/models/WeeklySchedule"; // Adjust this path as needed
import { connectDB } from "@/mongoose";

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

    // Find the schedule document for the given teacher and week start date
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
    } else {
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
