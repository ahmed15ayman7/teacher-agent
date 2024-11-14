import mongoose, { Document, Schema, Model } from "mongoose";

export interface Lesson {
  period: number;
  day: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday";
  notes: {
    absent?: boolean;
    late?: { isLate: boolean; duration: number };
    earlyLeave?: { leftEarly: boolean; remainingTime: number };
    didNotSendWeeklyPlan?: boolean;
    missedLesson?: boolean;
    missedStandby?: boolean;
    enteredStandby?: mongoose.Types.ObjectId;
    lateForWork?: boolean;
    didNotActivateSupervision?: boolean;
    leftSchool?: boolean;
  };
}

interface WeeklyScheduleDocument extends Document {
  teacher: mongoose.Types.ObjectId;
  weekStartDate: Date;
  lessons: Lesson[];
}

const lessonSchema = new Schema<Lesson>({
  period: { type: Number, required: true },
  day: {
    type: String,
    enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    required: true,
  },
  notes: {
    absent: { type: Boolean, default: false },
    note: { type: String },
    late: {
      isLate: { type: Boolean, default: false },
      duration: { type: Number, default: 0 },
    },
    earlyLeave: {
      leftEarly: { type: Boolean, default: false },
      remainingTime: { type: Number, default: 0 },
    },
    didNotSendWeeklyPlan: { type: Boolean, default: false },
    missedLesson: { type: Boolean, default: false },
    missedStandby: { type: Boolean, default: false },
    enteredStandby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    lateForWork: { type: Boolean, default: false },
    didNotActivateSupervision: { type: Boolean, default: false },
    leftSchool: { type: Boolean, default: false },
  },
});

const weeklyScheduleSchema = new Schema<WeeklyScheduleDocument>({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  weekStartDate: { type: Date, required: true },
  lessons: [lessonSchema],
});

const WeeklySchedule = (mongoose.models.WeeklySchedule ||
  mongoose.model<WeeklyScheduleDocument>(
    "WeeklySchedule",
    weeklyScheduleSchema
  )) as Model<WeeklyScheduleDocument>;

export default WeeklySchedule;
