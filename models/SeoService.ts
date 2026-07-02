import mongoose, { Schema, Document } from "mongoose";

export interface ISeoService extends Document {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  heroImage: string;
  videoUrl?: string;
  intro: string;
  highlights: string[];
  process: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const SeoServiceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    shortTitle: { type: String, required: true, trim: true },
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: { type: String, required: true, trim: true },
    keywords: { type: [String], default: [] },
    category: { type: String, required: true, trim: true },
    heroImage: { type: String, required: true },
    videoUrl: { type: String, default: "", trim: true },
    intro: { type: String, required: true },
    highlights: { type: [String], default: [] },
    process: { type: [String], default: [] },
    faqs: { type: [FaqSchema], default: [] },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SeoServiceSchema.index({ isActive: 1, sortOrder: 1, title: 1 });

export default mongoose.models.SeoService || mongoose.model<ISeoService>("SeoService", SeoServiceSchema);
