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
