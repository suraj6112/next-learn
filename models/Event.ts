import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  category: string;
  subcategory?: string;
  categoryId?: mongoose.Types.ObjectId;
  subcategoryId?: mongoose.Types.ObjectId;
  description: string;
  mediaUrls: string[]; // List of photo/video URLs from Cloudinary
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: "" },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  subcategoryId: { type: Schema.Types.ObjectId, ref: "Subcategory" },
  description: { type: String, required: true },
  mediaUrls: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
