import mongoose, { Schema, Document } from "mongoose";

export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  coverImage: string;
  city: string;
  venue?: string;
  relatedServiceSlug?: string;
  relatedLocationSlug?: string;
  eventType: string;
  objective: string;
  execution: string;
  result: string;
  highlights: string[];
  mediaUrls: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  eventDate?: Date;
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

const CaseStudySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: { type: String, required: true, trim: true },
    keywords: { type: [String], default: [] },
    coverImage: { type: String, required: true },
    city: { type: String, required: true, trim: true },
    venue: { type: String, default: "" },
    relatedServiceSlug: { type: String, default: "" },
    relatedLocationSlug: { type: String, default: "" },
    eventType: { type: String, required: true, trim: true },
    objective: { type: String, required: true },
    execution: { type: String, required: true },
    result: { type: String, required: true },
    highlights: { type: [String], default: [] },
    mediaUrls: { type: [String], default: [] },
    faqs: { type: [FaqSchema], default: [] },
    sortOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    eventDate: { type: Date },
  },
  { timestamps: true }
);

CaseStudySchema.index({ isActive: 1, isFeatured: 1, sortOrder: 1, eventDate: -1 });

export default mongoose.models.CaseStudy || mongoose.model<ICaseStudy>("CaseStudy", CaseStudySchema);
