import { z } from "zod";

export const schoolSchema = z.object({
    schoolName: z.string().min(1, "اسم المدرسة مطلوب"),
    principal: z.string().min(1, "مدير المدرسة مطلوب"),
    deputy: z.string().min(1, "وكيل الشؤون التعليمية مطلوب"),
    studentCount: z.number().min(1, "عدد الطلاب مطلوب"),
    teacherCount: z.number().min(1, "عدد المعلمين مطلوب"),
    classCount: z.number().min(1, "عدد الفصول مطلوب"),
    password: z.string().min(6, "كلمة المرور مطلوبة"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
    timePeriod: z.string().min(1, "الوقت مطلوب"),
    dateM: z.string().min(1, "التاريخ الميلادي مطلوب"),
    dateH: z.string().min(1, "التاريخ الهجري مطلوب"),
    stage: z.enum(["ابتدائي", "متوسط", "ثانوي"],{message: "المرحلة مطلوبة"})
  });
 export type SchoolSchema=z.infer<typeof schoolSchema>