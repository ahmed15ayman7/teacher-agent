import { connectDB } from '@/mongoose';
import Teacher from '@/lib/models/Teacher';
import { NextResponse } from 'next/server';

// استرجاع جميع المعلمين
export async function GET() {
  await connectDB();
  const teachers = await Teacher.find({});
  return NextResponse.json(teachers);
}

export async function POST(request:Request) {
  await connectDB();
  const data = await request.json();
  try {
    const teacher = new Teacher(data);
    await teacher.save();
    return NextResponse.json(teacher, { status: 201 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request:Request) {
  await connectDB();
  const { id, ...data } = await request.json();
  try {
    const teacher = await Teacher.findByIdAndUpdate(id, data, { new: true });
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }
    return NextResponse.json(teacher);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// حذف معلم
export async function DELETE(request:Request) {
  await connectDB();
  const { id } = await request.json();
  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
