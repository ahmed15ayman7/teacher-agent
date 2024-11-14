// /api/teachers/[id]
import { connectDB } from '@/mongoose';
import Teacher from '@/lib/models/Teacher';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectDB();
    try {
        const teacher = await Teacher.findById(params.id);

        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }

        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teacher data" }, { status: 500 });
    }
}
