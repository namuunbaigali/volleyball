import mongoose, { Schema, Document } from 'mongoose';

export interface IImageEntry {
  url: string;
  uploadedAt: Date;
}

export interface ITournament extends Document {
  title: string;
  description: string;
  date: string;
  location: string;
  locationMapLink: string;
  guidelineInfo: string;
  posters: IImageEntry[];
  schedules: IImageEntry[];
  guideline: IImageEntry[];
  registrationDeadline: string;
  prizeInfo: string;
  updatedAt: Date;
}

const ImageEntrySchema = new Schema<IImageEntry>({
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const TournamentSchema = new Schema<ITournament>(
  {
    title: { type: String, default: 'Волейбол тэмцээн 2025' },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
    location: { type: String, default: '' },
    locationMapLink: { type: String, default: '' },
    guidelineInfo: { type: String, default: '' },
    posters: { type: [ImageEntrySchema], default: [] },
    schedules: { type: [ImageEntrySchema], default: [] },
    guideline: { type: [ImageEntrySchema], default: [] },
    registrationDeadline: { type: String, default: '' },
    prizeInfo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Tournament ||
  mongoose.model<ITournament>('Tournament', TournamentSchema);
