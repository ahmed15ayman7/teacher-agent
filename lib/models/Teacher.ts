import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: false },
  civilRecord: { type: String, required: false },
  sessionCount: { type: Number, required: false },
  phoneNumber: { type: String, required: false },
  teachingStage: { type: String, enum: ['Primary', 'Intermediate', 'Secondary'], required: true },
  birthDate: { type: Date, required: false },
  supervisionDay: { type: String, required: false },
  qualification: { type: String, required: false },
  TeachingMaterials: { type: String, required: false },
  CorrespondenceEmail: { type: String, required: false },
OtherTasksAssigned: { type: String, required: false },
SupervisionPlace: { type: String, required: false },
ClassesTaught: { type: String, required: false },
});

export default mongoose.models.Teacher || mongoose.model('Teacher', TeacherSchema);
