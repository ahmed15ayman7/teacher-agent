import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISchool extends Document {
  schoolName: string;
  principal: string;
  deputy: string;
  studentCount: string;
  teacherCount: string;
  classCount: string;
  stage: "Primary" | "Intermediate" | "Secondary";
  timePeriod: string;
  dateM: string;
  dateH: string;
  password: string;
}

const SchoolSchema: Schema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    principal: { type: String, required: true },
    deputy: { type: String, required: true },
    studentCount: { type: String, required: true },
    teacherCount: { type: String, required: true },
    classCount: { type: String, required: true },
    stage: {
      type: String,
      enum: ["Primary", "Intermediate", "Secondary"],
      required: true,
    },
    timePeriod: { type: String, required: true },
    dateM: { type: String, required: true },
    dateH: { type: String, required: true },
    password: { type: String, required: true },
    teachers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true }
);

const School: Model<ISchool> =
  mongoose.models.School || mongoose.model<ISchool>("School", SchoolSchema);

export default School;
