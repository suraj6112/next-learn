import mongoose, { Schema, Document } from "mongoose";

export interface IGallery extends Document {
  title: string;
  category: string;
  subcategory?: string;
  categoryId?: mongoose.Types.ObjectId;
  subcategoryId?: mongoose.Types.ObjectId;
  description?: string;
  altText?: string;
  caption?: string;
  city?: string;
  serviceSlug?: string;
  duration?: string;
  mediaType: "image" | "video";
  cloudinaryUrl: string;
  thumbnail?: string;
  featured: boolean;
  showOnHome: boolean;
  isReel: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, default: "", trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    subcategoryId: { type: Schema.Types.ObjectId, ref: "Subcategory" },
    description: { type: String, default: "" },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
    city: { type: String, default: "" },
    serviceSlug: { type: String, default: "" },
    duration: { type: String, default: "" },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    cloudinaryUrl: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: false },
    isReel: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GallerySchema.index({ categoryId: 1, subcategoryId: 1, isActive: 1, sortOrder: 1 });
GallerySchema.index({ featured: 1, showOnHome: 1, isReel: 1, isActive: 1 });

const existingGalleryModel = mongoose.models.Gallery as mongoose.Model<IGallery> | undefined;

if (existingGalleryModel && !existingGalleryModel.schema.path("categoryId")) {
  mongoose.deleteModel("Gallery");
}

export default mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);
