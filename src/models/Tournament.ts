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
  googleMapsUrl: string;
  posters: IImageEntry[];
  schedules: IImageEntry[];
  guidelines: IImageEntry[];
  guidelinesNote: string;
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
    googleMapsUrl: { type: String, default: '' },
    posters: { type: [ImageEntrySchema], default: [] },
    schedules: { type: [ImageEntrySchema], default: [] },
    guidelines: { type: [ImageEntrySchema], default: [] },
    guidelinesNote: { type: String, default: '' },
    registrationDeadline: { type: String, default: '' },
    prizeInfo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Tournament ||
  mongoose.model<ITournament>('Tournament', TournamentSchema);
