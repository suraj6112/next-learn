import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
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

    const { title, category, description, mediaUrls } = await request.json();

    if (!title || !category || !description) {
      return NextResponse.json(
        { success: false, message: "Title, category, and description are required" },
        { status: 400 }
      ) as any;
    }

    const event = await Event.create({
      title,
      category,
      description,
      mediaUrls: mediaUrls || [],
    });

    return NextResponse.json({
      success: true,
      message: "Event added successfully",
      data: event,
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
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: events });
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
    const token = getAuthTokenFromHeader(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      ) as any;
    }

    const { id, title, category, description, mediaUrls } = await request.json();

    if (!id || !title || !category || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields for update" },
        { status: 400 }
      ) as any;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        category,
        description,
        mediaUrls: mediaUrls || [],
      },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      ) as any;
    }

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const token = getAuthTokenFromHeader(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      ) as any;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing event ID in query parameter" },
        { status: 400 }
      ) as any;
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      ) as any;
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
