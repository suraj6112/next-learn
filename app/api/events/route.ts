/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { verifyToken, getAuthTokenFromHeader } from "@/lib/auth";

async function resolveTaxonomy(payload: any) {
  let categoryName = payload.category || "";
  let subcategoryName = payload.subcategory || "";

  if (payload.categoryId) {
    const categoryDoc = await Category.findById(payload.categoryId).lean();
    if (!categoryDoc) {
      throw new Error("Selected category was not found");
    }
    categoryName = (categoryDoc as any).name;
  }

  if (payload.subcategoryId) {
    const subcategoryDoc = await Subcategory.findById(payload.subcategoryId).lean();
    if (!subcategoryDoc) {
      throw new Error("Selected subcategory was not found");
    }
    subcategoryName = (subcategoryDoc as any).name;
  }

  return { categoryName, subcategoryName };
}

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

    const payload = await request.json();
    const { title, categoryId, subcategoryId, description, mediaUrls } = payload;
    const { categoryName, subcategoryName } = await resolveTaxonomy(payload);

    if (!title || !categoryName || !description) {
      return NextResponse.json(
        { success: false, message: "Title, category, and description are required" },
        { status: 400 }
      ) as any;
    }

    const event = await Event.create({
      title,
      category: categoryName,
      subcategory: subcategoryName,
      categoryId: categoryId || undefined,
      subcategoryId: subcategoryId || undefined,
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
    const events = await Event.find({})
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug")
      .sort({ createdAt: -1 });
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

    const payload = await request.json();
    const { id, title, categoryId, subcategoryId, description, mediaUrls } = payload;
    const { categoryName, subcategoryName } = await resolveTaxonomy(payload);

    if (!id || !title || !categoryName || !description) {
      return NextResponse.json(
        { success: false, message: "Missing required fields for update" },
        { status: 400 }
      ) as any;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        category: categoryName,
        subcategory: subcategoryName,
        categoryId: categoryId || undefined,
        subcategoryId: subcategoryId || undefined,
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
