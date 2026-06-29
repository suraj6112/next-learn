/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { verifyToken, getAuthTokenFromHeader } from "@/lib/auth";
import Subcategory from "@/models/Subcategory";

function isAuthorized(request: Request) {
  const token = getAuthTokenFromHeader(request.headers);
  return !!token && !!verifyToken(token);
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const filter: any = includeInactive ? {} : { isActive: true };
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const subcategories = await Subcategory.find(filter)
      .populate("categoryId", "name slug")
      .sort({ sortOrder: 1, name: 1 });

    return NextResponse.json({ success: true, data: subcategories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    const { categoryId, name, slug, description, coverImage, sortOrder, isActive } = await request.json();
    if (!categoryId || !name) {
      return NextResponse.json(
        { success: false, message: "Category and subcategory name are required" },
        { status: 400 }
      ) as any;
    }

    const subcategory = await Subcategory.create({
      categoryId,
      name,
      slug: slug ? createSlug(slug) : createSlug(name),
      description: description || "",
      coverImage: coverImage || "",
      sortOrder: Number(sortOrder) || 0,
      isActive: isActive !== false,
    });

    return NextResponse.json({ success: true, message: "Subcategory created successfully", data: subcategory });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A subcategory with this slug already exists in this category" : undefined;
    return NextResponse.json(
      { success: false, message: duplicateMessage || error.message || "Internal Server Error" },
      { status: duplicateMessage ? 409 : 500 }
    ) as any;
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    const { id, categoryId, name, slug, description, coverImage, sortOrder, isActive } = await request.json();
    if (!id || !categoryId || !name) {
      return NextResponse.json(
        { success: false, message: "Subcategory ID, category, and name are required" },
        { status: 400 }
      ) as any;
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      {
        categoryId,
        name,
        slug: slug ? createSlug(slug) : createSlug(name),
        description: description || "",
        coverImage: coverImage || "",
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      },
      { new: true }
    );

    if (!updatedSubcategory) {
      return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "Subcategory updated successfully", data: updatedSubcategory });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A subcategory with this slug already exists in this category" : undefined;
    return NextResponse.json(
      { success: false, message: duplicateMessage || error.message || "Internal Server Error" },
      { status: duplicateMessage ? 409 : 500 }
    ) as any;
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing subcategory ID" }, { status: 400 }) as any;
    }

    const deletedSubcategory = await Subcategory.findByIdAndDelete(id);
    if (!deletedSubcategory) {
      return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "Subcategory deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
