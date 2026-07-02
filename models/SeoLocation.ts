import mongoose, { Schema, Document } from "mongoose";

export interface ISeoLocation extends Document {
  slug: string;
  city: string;
  region: string;
  state: string;
  serviceAreas: string[];
  intro: string;
  videoUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SeoLocationSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    serviceAreas: { type: [String], default: [] },
    intro: { type: String, required: true },
    videoUrl: { type: String, default: "", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SeoLocationSchema.index({ isActive: 1, sortOrder: 1, city: 1 });

export default mongoose.models.SeoLocation || mongoose.model<ISeoLocation>("SeoLocation", SeoLocationSchema);
