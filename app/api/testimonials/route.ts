import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { verifyToken, getAuthTokenFromHeader } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const token = getAuthTokenFromHeader(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      ) as any;
    }

    const { name, eventType, review, rating } = await request.json();

    if (!name || !eventType || !review || !rating) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      ) as any;
    }

    const testimonial = await Testimonial.create({
      name,
      eventType,
      review,
      rating: Number(rating),
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial added successfully",
      data: testimonial,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
