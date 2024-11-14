import WeeklySchedule from '@/lib/models/WeeklySchedule';
import { connectDB } from '@/mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const TeacherId = searchParams.get('TeacherId');

    try {
        const filters: { weekStartDate?: { $gte?: Date; $lte?: Date }, teacher?: string } = {};

        if (start && end && TeacherId) {
            filters.weekStartDate = { $gte: new Date(start), $lte: new Date(end), };
            filters.teacher = TeacherId;
        } else if (start) {
            filters.weekStartDate = { $gte: new Date(start) };
        }
        else if (end) {
            filters.weekStartDate = { $lte: new Date(end) };
        }
        else if (TeacherId) {
            filters.teacher = TeacherId;
        }

        const schedules = await WeeklySchedule.find(filters).populate('teacher');
        return NextResponse.json(schedules, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
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
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}