import Teacher from "@/lib/models/Teacher";
import WeeklySchedule from "@/lib/models/WeeklySchedule";
import { connectDB } from "@/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const TeacherId = searchParams.get("TeacherId");

  try {
    const filters: {
      // weekStartDate?: { $gte?: Date; $lte?: Date };
      $or?: (
        | { teacher: string }
        | { isTemplate: boolean }
        | { weekStartDate: any }
      )[];
    } = {};

    if (start && end) {
      filters.$or?.push({
        weekStartDate: { $gte: new Date(start), $lte: new Date(end) },
      });
    }
    // else if (start) {
    //   filters.$or?.push({weekStartDate:{ $gte: new Date(start) }})
    // } else if (end) {
    //   filters.$or?.push({weekStartDate: { $lte: new Date(end) }})
    // }

    if (TeacherId) {
      const teacherIds = TeacherId.split(",");
      filters.$or = [
        // { isTemplate: true },
        ...teacherIds.map((id) => ({ teacher: id })),
      ];
    }

    const schedules = await WeeklySchedule.find(filters).populate({
      path: "teacher",
      model: Teacher,
    });
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const data = await request.json();
    const newSchedule = new WeeklySchedule(data);
    await newSchedule.save();
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
