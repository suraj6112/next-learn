import mongoose, { Schema, Document } from "mongoose";

export interface IPackage extends Document {
  name: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  coverImage: string;
  shortDescription: string;
  description: string;
  relatedServiceSlug?: string;
  relatedLocationSlug?: string;
  startingPrice?: string;
  idealFor: string[];
  inclusions: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  isFeatured: boolean;
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

const PackageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: { type: String, required: true, trim: true },
    keywords: { type: [String], default: [] },
    coverImage: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    relatedServiceSlug: { type: String, default: "" },
    relatedLocationSlug: { type: String, default: "" },
    startingPrice: { type: String, default: "" },
    idealFor: { type: [String], default: [] },
    inclusions: { type: [String], default: [] },
    faqs: { type: [FaqSchema], default: [] },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PackageSchema.index({ isActive: 1, isFeatured: 1, sortOrder: 1 });

export default mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
