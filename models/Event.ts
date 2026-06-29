import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  category: string;
  description: string;
  mediaUrls: string[]; // List of photo/video URLs from Cloudinary
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  mediaUrls: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
