import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { verifyToken, getAuthTokenFromHeader } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, mobile, eventType, eventDate, message } = await request.json();

    if (!name || !mobile || !eventType || !eventDate || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      ) as any;
    }

    const inquiry = await Inquiry.create({
      name,
      mobile,
      eventType,
      eventDate: new Date(eventDate),
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully",
      data: inquiry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const token = getAuthTokenFromHeader(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      ) as any;
    }

    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
