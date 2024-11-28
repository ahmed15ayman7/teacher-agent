"use server";
import { cookies } from "next/headers";
import WeeklySchedule from "../models/WeeklySchedule";
import { connectDB } from "@/mongoose";
import Teacher from "../models/Teacher";

export async function getSchoolData() {
  const cookieStore = cookies();
  const SchoolDataCookie = cookieStore.get("SchoolData");

  // console.error("iiiiiiiiiiiii-----",SchoolDataCookie)
  if (SchoolDataCookie) {
    try {
      const SchoolData = JSON.parse(SchoolDataCookie.value);
      // console.log(SchoolData)
      return SchoolData;
    } catch (error) {
      console.error("Error parsing School data cookie:", error);
    }
  }
  return null;
}
export async function setSchoolData() {
  const cookieStore = cookies();
  cookieStore.delete("SchoolData");
  cookieStore.delete("authTokenSchool");

  return null;
}
export async function setSchoolData2(SchoolData: any) {
  const cookieStore = cookies();
  cookieStore.set("SchoolData", JSON.stringify(SchoolData));

  return null;
}

export const uploadGenralSc = async (teachersData: any[]) => {
  try {
    await connectDB();
    for (const schedule of teachersData) {
      let s = await WeeklySchedule.create(schedule);
      await s.save();
      let t = await Teacher.findById(schedule.teacher);
      t.WeeklySchedule.push(s._id);
      await t.save();
    }
  } catch (e: any) {
    console.error(e);
  }
};
export const uploadeTeachersEx = async (teachers: any[]) => {
  await connectDB();
  await Teacher.insertMany(teachers);
};
export const getTeacher = async (teacherName: string) => {
  await connectDB();

  // تقسيم الاسم إلى كلمات (باستخدام الفراغات)
  const words = teacherName.split(" ");

  // إنشاء تعبير منتظم يحتوي على جميع الكلمات مع دعم وجود كلمات إضافية
  const regexPattern = words.map((word) => `(?=.*${word})`).join("") + ".*";
  const regex = new RegExp(regexPattern, "i"); // "i" لجعل البحث غير حساس لحالة الأحرف

  // البحث في قاعدة البيانات
  const teacher = await Teacher.findOne({
    name: { $regex: regex },
  }).lean();

  return teacher as { _id: string };
};
