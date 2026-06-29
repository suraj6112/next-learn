import mongoose, { Schema, Document } from "mongoose";

export interface IHomeStatItem {
  key: string;
  label: string;
  value: number;
  suffix: string;
  sortOrder: number;
  isActive: boolean;
}

export interface IHomeStat extends Document {
  sectionKey: string;
  stats: IHomeStatItem[];
  updatedAt: Date;
  createdAt: Date;
}

const HomeStatItemSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: "+", trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const HomeStatSchema: Schema = new Schema(
  {
    sectionKey: { type: String, required: true, unique: true, default: "home" },
    stats: { type: [HomeStatItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.HomeStat || mongoose.model<IHomeStat>("HomeStat", HomeStatSchema);
