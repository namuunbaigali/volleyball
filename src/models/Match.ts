import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  team1Name: string;
  team2Name: string;
  category: string;
  scheduledTime: string;
  court: string;
  status: 'scheduled' | 'playing' | 'done' | 'delayed';
  delayMinutes: number;
  score1: string;
  score2: string;
  note: string;
  order: number;
}

const MatchSchema = new Schema<IMatch>(
  {
    team1Name: { type: String, required: true },
    team2Name: { type: String, required: true },
    category: { type: String, required: true },
    scheduledTime: { type: String, required: true },
    court: { type: String, default: '1-р талбай' },
    status: {
      type: String,
      enum: ['scheduled', 'playing', 'done', 'delayed'],
      default: 'scheduled',
    },
    delayMinutes: { type: Number, default: 0 },
    score1: { type: String, default: '' },
    score2: { type: String, default: '' },
    note: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
