import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISchool extends Document {
  schoolName: string;
  principal: string;
  deputy: string;
  studentCount: number;
  teacherCount: number;
  classCount: number;
  stage: 'ابتدائي' | 'متوسط' | 'ثانوي';
  timePeriod: string;
  dateM: string;
  dateH: string;
  password: string;
}

const SchoolSchema: Schema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  principal: { type: String, required: true },
  deputy: { type: String, required: true },
  studentCount: { type: Number, required: true },
  teacherCount: { type: Number, required: true },
  classCount: { type: Number, required: true },
  stage: { type: String, enum: ['ابتدائي', 'متوسط', 'ثانوي'], required: true },
  timePeriod: { type: String, required: true },
  dateM: { type: String, required: true },
  dateH: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

const School: Model<ISchool> = mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);

export default School;
