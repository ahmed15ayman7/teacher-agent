import { NextResponse } from "next/server";
import School, { ISchool } from "@/lib/models/school";
import { connectDB } from "@/mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { body }: { body: ISchool } = await req.json();
    const newSchool = new School(body);
    await newSchool.save();
    return NextResponse.json(
      { success: true, data: newSchool },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { body, _id }: { body: ISchool; _id: string } = await req.json();
    const school = await School.findByIdAndUpdate(_id, body);
    return NextResponse.json({ success: true, data: school }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get("_id");

    if (!schoolId) {
      return NextResponse.json(
        { success: false, error: "School ID is required" },
        { status: 400 }
      );
    }

    const school = await School.findById(schoolId).populate("teachers");

    if (!school) {
      return NextResponse.json(
        { success: false, error: "School not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: school }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
