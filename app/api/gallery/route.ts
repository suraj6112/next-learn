/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";
import { verifyToken, getAuthTokenFromHeader } from "@/lib/auth";

function isAuthorized(request: Request) {
  const token = getAuthTokenFromHeader(request.headers);
  return !!token && !!verifyToken(token);
}

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
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      ) as any;
    }

    const payload = await request.json();
    const {
      title,
      categoryId,
      subcategoryId,
      description,
      altText,
      caption,
      city,
      serviceSlug,
      duration,
      mediaType,
      cloudinaryUrl,
      thumbnail,
      featured,
      showOnHome,
      isReel,
      sortOrder,
      isActive,
    } = payload;
    const { categoryName, subcategoryName } = await resolveTaxonomy(payload);

    if (!title || !categoryName || !mediaType || !cloudinaryUrl) {
      return NextResponse.json(
        { success: false, message: "Title, category, mediaType, and cloudinaryUrl are required" },
        { status: 400 }
      ) as any;
    }

    const item = await Gallery.create({
      title,
      category: categoryName,
      subcategory: subcategoryName,
      categoryId: categoryId || undefined,
      subcategoryId: subcategoryId || undefined,
      description: description || "",
      altText: altText || "",
      caption: caption || "",
      city: city || "",
      serviceSlug: serviceSlug || "",
      duration: duration || "",
      mediaType,
      cloudinaryUrl,
      thumbnail: thumbnail || "",
      featured: featured === true,
      showOnHome: showOnHome === true,
      isReel: isReel === true,
      sortOrder: Number(sortOrder) || 0,
      isActive: isActive !== false,
    });

    return NextResponse.json({
      success: true,
      message: "Gallery item added successfully",
      data: item,
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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const subcategory = searchParams.get("subcategory");
    const subcategoryId = searchParams.get("subcategoryId");
    const city = searchParams.get("city");
    const serviceSlug = searchParams.get("serviceSlug");
    const featuredOnly = searchParams.get("featured") === "true";
    const homeOnly = searchParams.get("showOnHome") === "true";
    const reelsOnly = searchParams.get("reels") === "true";
    const includeInactive = searchParams.get("includeInactive") === "true";

    const filter: any = {};
    if (!includeInactive) {
      filter.isActive = true;
    }
    if (category && category !== "All") {
      filter.category = category;
    }
    if (categoryId && categoryId !== "All") {
      filter.categoryId = categoryId;
    }
    if (subcategory && subcategory !== "All") {
      filter.subcategory = subcategory;
    }
    if (subcategoryId && subcategoryId !== "All") {
      filter.subcategoryId = subcategoryId;
    }
    if (city && city !== "All") {
      filter.city = city;
    }
    if (serviceSlug && serviceSlug !== "All") {
      filter.serviceSlug = serviceSlug;
    }
    if (featuredOnly) {
      filter.featured = true;
    }
    if (homeOnly) {
      filter.showOnHome = true;
    }
    if (reelsOnly) {
      filter.isReel = true;
      filter.mediaType = "video";
    }

    const items = await Gallery.find(filter)
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug")
      .sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: items });
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
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      ) as any;
    }

    const payload = await request.json();
    const {
      id,
      title,
      categoryId,
      subcategoryId,
      description,
      altText,
      caption,
      city,
      serviceSlug,
      duration,
      mediaType,
      cloudinaryUrl,
      thumbnail,
      featured,
      showOnHome,
      isReel,
      sortOrder,
      isActive,
    } = payload;
    const { categoryName, subcategoryName } = await resolveTaxonomy(payload);

    if (!id || !title || !categoryName || !mediaType || !cloudinaryUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required update fields" },
        { status: 400 }
      ) as any;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      {
        title,
        category: categoryName,
        subcategory: subcategoryName,
        categoryId: categoryId || undefined,
        subcategoryId: subcategoryId || undefined,
        description: description || "",
        altText: altText || "",
        caption: caption || "",
        city: city || "",
        serviceSlug: serviceSlug || "",
        duration: duration || "",
        mediaType,
        cloudinaryUrl,
        thumbnail: thumbnail || "",
        featured: featured === true,
        showOnHome: showOnHome === true,
        isReel: isReel === true,
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found" },
        { status: 404 }
      ) as any;
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item updated successfully",
      data: updatedItem,
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
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      ) as any;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing item ID in query parameter" },
        { status: 400 }
      ) as any;
    }

    const deletedItem = await Gallery.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found" },
        { status: 404 }
      ) as any;
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
