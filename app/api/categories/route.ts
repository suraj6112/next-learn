/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { verifyToken, getAuthTokenFromHeader } from "@/lib/auth";
import Category from "@/models/Category";
import Subcategory from "@/models/Subcategory";

function isAuthorized(request: Request) {
  const token = getAuthTokenFromHeader(request.headers);
  return !!token && !!verifyToken(token);
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const includeSubcategories = searchParams.get("includeSubcategories") === "true";

    const filter = includeInactive ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 }).lean();

    if (!includeSubcategories) {
      return NextResponse.json({ success: true, data: categories });
    }

    const subcategories = await Subcategory.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
    const data = categories.map((category: any) => ({
      ...category,
      subcategories: subcategories.filter((subcategory: any) => String(subcategory.categoryId) === String(category._id)),
    }));

    return NextResponse.json({ success: true, data });
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

    const { name, slug, description, coverImage, sortOrder, isActive } = await request.json();
    if (!name) {
      return NextResponse.json({ success: false, message: "Category name is required" }, { status: 400 }) as any;
    }

    const category = await Category.create({
      name,
      slug: slug ? createSlug(slug) : createSlug(name),
      description: description || "",
      coverImage: coverImage || "",
      sortOrder: Number(sortOrder) || 0,
      isActive: isActive !== false,
    });

    return NextResponse.json({ success: true, message: "Category created successfully", data: category });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A category with this slug already exists" : undefined;
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

    const { id, name, slug, description, coverImage, sortOrder, isActive } = await request.json();
    if (!id || !name) {
      return NextResponse.json({ success: false, message: "Category ID and name are required" }, { status: 400 }) as any;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: slug ? createSlug(slug) : createSlug(name),
        description: description || "",
        coverImage: coverImage || "",
        sortOrder: Number(sortOrder) || 0,
        isActive: isActive !== false,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "Category updated successfully", data: updatedCategory });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A category with this slug already exists" : undefined;
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
      return NextResponse.json({ success: false, message: "Missing category ID" }, { status: 400 }) as any;
    }

    await Subcategory.deleteMany({ categoryId: id });
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "Category and its subcategories deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
