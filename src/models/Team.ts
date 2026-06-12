import mongoose, { Schema, Document } from 'mongoose';

export interface IMember {
  firstName: string;
  lastName: string;
  graduationYear: number;
  teacherName: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
}

export interface ITeam extends Document {
  teamName: string;
  teamGender: 'male' | 'female';
  school: string;
  contactPhone: string;
  contactEmail: string;
  members: IMember[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const MemberSchema = new Schema<IMember>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  teacherName: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
});

const TeamSchema = new Schema<ITeam>(
  {
    teamName: { type: String, required: true },
    teamGender: { type: String, enum: ['male', 'female'], required: true },
    school: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
    members: {
      type: [MemberSchema],
      validate: {
        validator: (v: IMember[]) => v.length >= 6 && v.length <= 12,
        message: 'Багт 6-12 гишүүн байх ёстой',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
