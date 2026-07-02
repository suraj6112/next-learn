import mongoose, { Schema, Document } from "mongoose";

export interface IContactSetting extends Document {
  sectionKey: string;
  phoneLabel: string;
  phone: string;
  phoneHref: string;
  phoneLabel2: string;
  phone2: string;
  phoneHref2: string;
  whatsappNumber: string;
  emailLabel: string;
  email: string;
  addressLabel: string;
  address: string;
  instagramUrl: string;
  updatedAt: Date;
  createdAt: Date;
}

const ContactSettingSchema: Schema = new Schema(
  {
    sectionKey: { type: String, required: true, unique: true, default: "contact" },
    phoneLabel: { type: String, default: "Call/Call Helpline", trim: true },
    phone: { type: String, default: "+91 99999 99999", trim: true },
    phoneHref: { type: String, default: "tel:+919999999999", trim: true },
    phoneLabel2: { type: String, default: "Alternate Call", trim: true },
    phone2: { type: String, default: "", trim: true },
    phoneHref2: { type: String, default: "", trim: true },
    whatsappNumber: { type: String, default: "919999999999", trim: true },
    emailLabel: { type: String, default: "Send Professional Email", trim: true },
    email: { type: String, default: "bookings@skysfx.in", trim: true },
    addressLabel: { type: String, default: "HQ Location", trim: true },
    address: { type: String, default: "SKY SFX, Jaipur, Rajasthan, India", trim: true },
    instagramUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.ContactSetting || mongoose.model<IContactSetting>("ContactSetting", ContactSettingSchema);
