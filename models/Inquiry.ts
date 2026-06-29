import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  name: string;
  mobile: string;
  eventType: string;
  eventDate: Date;
  message: string;
  createdAt: Date;
}

const InquirySchema: Schema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
