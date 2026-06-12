import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
  title: string;
  description: string;
  date: string;
  location: string;
  posterUrl: string;
  scheduleUrl: string;
  registrationDeadline: string;
  prizeInfo: string;
  updatedAt: Date;
}

const TournamentSchema = new Schema<ITournament>(
  {
    title: { type: String, default: 'Волейбол тэмцээн 2025' },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    location: { type: String, default: '' },
    posterUrl: { type: String, default: '' },
    scheduleUrl: { type: String, default: '' },
    registrationDeadline: { type: String, default: '' },
    prizeInfo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Tournament ||
  mongoose.model<ITournament>('Tournament', TournamentSchema);
