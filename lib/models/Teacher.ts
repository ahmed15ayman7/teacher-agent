import mongoose from "mongoose";
export interface ITeacher {
  name: string;
  specialization?: string;
  civilRecord?: string;
  sessionCount?: number;
  phoneNumber?: string;
  teachingStage: "Primary" | "Intermediate" | "Secondary";
  birthDate?: Date;
  supervisionDay?: string;
  qualification?: string;
  TeachingMaterials?: string;
  CorrespondenceEmail?: string;
  OtherTasksAssigned?: string;
  SupervisionPlace?: string;
  ClassesTaught?: string;
  WeeklySchedule?: string[];
  schoolId: string;
}

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  civilRecord: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  specialization: { type: String, required: false },
  schoolId: { type: String, required: true },
  sessionCount: { type: Number, required: false },
  teachingStage: {
    type: String,
    enum: ["Primary", "Intermediate", "Secondary"],
    // required: true,
  },
  birthDate: { type: Date, required: false },
  supervisionDay: { type: String, required: false },
  qualification: { type: String, required: false },
  TeachingMaterials: { type: String, required: false },
  CorrespondenceEmail: { type: String, required: false },
  OtherTasksAssigned: { type: String, required: false },
  SupervisionPlace: { type: String, required: false },
  ClassesTaught: { type: String, required: false },
  WeeklySchedule: [
    { type: mongoose.Schema.Types.ObjectId, ref: "WeeklySchedule" },
  ],
});

export default mongoose.models.Teacher ||
  mongoose.model("Teacher", TeacherSchema);
