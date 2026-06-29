/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { businessProfile } from "@/lib/business-profile";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import ContactSetting from "@/models/ContactSetting";

const DEFAULT_CONTACT_SETTINGS = {
  phoneLabel: "Call/Call Helpline",
  phone: businessProfile.phone,
  phoneHref: businessProfile.phoneHref,
  whatsappNumber: businessProfile.whatsappNumber,
  emailLabel: "Send Professional Email",
  email: businessProfile.email,
  addressLabel: "HQ Location",
  address: `${businessProfile.name}, ${businessProfile.city}, ${businessProfile.region}, ${businessProfile.country}`,
  instagramUrl: "",
  facebookUrl: "",
};

function isAuthorized(request: Request) {
  const token = getAuthTokenFromHeader(request.headers);
  return !!token && !!verifyToken(token);
}

function normalizePhoneHref(phoneHref: string, phone: string) {
  if (phoneHref?.trim()) return phoneHref.trim();
  const numericPhone = phone.replace(/[^\d+]/g, "");
  return numericPhone ? `tel:${numericPhone}` : DEFAULT_CONTACT_SETTINGS.phoneHref;
}

export async function GET() {
  try {
    await dbConnect();
    const settings = await ContactSetting.findOne({ sectionKey: "contact" }).lean();
    return NextResponse.json({ success: true, data: { ...DEFAULT_CONTACT_SETTINGS, ...(settings || {}) } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    const body = await request.json();
    const payload = {
      sectionKey: "contact",
      phoneLabel: body.phoneLabel || DEFAULT_CONTACT_SETTINGS.phoneLabel,
      phone: body.phone || DEFAULT_CONTACT_SETTINGS.phone,
      phoneHref: normalizePhoneHref(body.phoneHref || "", body.phone || DEFAULT_CONTACT_SETTINGS.phone),
      whatsappNumber: body.whatsappNumber || DEFAULT_CONTACT_SETTINGS.whatsappNumber,
      emailLabel: body.emailLabel || DEFAULT_CONTACT_SETTINGS.emailLabel,
      email: body.email || DEFAULT_CONTACT_SETTINGS.email,
      addressLabel: body.addressLabel || DEFAULT_CONTACT_SETTINGS.addressLabel,
      address: body.address || DEFAULT_CONTACT_SETTINGS.address,
      instagramUrl: body.instagramUrl || "",
      facebookUrl: body.facebookUrl || "",
    };

    const updated = await ContactSetting.findOneAndUpdate({ sectionKey: "contact" }, payload, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({ success: true, message: "Contact settings updated successfully", data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
