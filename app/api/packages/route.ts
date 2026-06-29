/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import Package from "@/models/Package";

function isAuthorized(request: Request) {
  const token = getAuthTokenFromHeader(request.headers);
  return !!token && !!verifyToken(token);
}

function cleanArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function cleanFaqs(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item: any) => ({
      question: String(item?.question || "").trim(),
      answer: String(item?.answer || "").trim(),
    }))
    .filter((item) => item.question && item.answer);
}

function buildPayload(body: any) {
  return {
    name: body.name,
    slug: body.slug ? createSlug(body.slug) : createSlug(body.name || ""),
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
    keywords: cleanArray(body.keywords),
    coverImage: body.coverImage,
    shortDescription: body.shortDescription,
    description: body.description,
    relatedServiceSlug: body.relatedServiceSlug || "",
    relatedLocationSlug: body.relatedLocationSlug || "",
    startingPrice: body.startingPrice || "",
    idealFor: cleanArray(body.idealFor),
    inclusions: cleanArray(body.inclusions),
    faqs: cleanFaqs(body.faqs),
    isFeatured: body.isFeatured === true,
    sortOrder: Number(body.sortOrder) || 0,
    isActive: body.isActive !== false,
  };
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const slug = searchParams.get("slug");
    const filter: any = includeInactive ? {} : { isActive: true };
    if (slug) filter.slug = slug;

    const packages = await Package.find(filter).sort({ sortOrder: 1, name: 1 });
    return NextResponse.json({ success: true, data: slug ? packages[0] || null : packages });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }) as any;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    const body = await request.json();
    const payload = buildPayload(body);
    if (!payload.name || !payload.slug || !payload.metaTitle || !payload.metaDescription || !payload.coverImage || !payload.shortDescription || !payload.description) {
      return NextResponse.json({ success: false, message: "Missing required package fields" }, { status: 400 }) as any;
    }

    const created = await Package.create(payload);
    return NextResponse.json({ success: true, message: "Package created", data: created });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A package with this slug already exists" : undefined;
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

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: "Package ID is required" }, { status: 400 }) as any;
    }

    const updated = await Package.findByIdAndUpdate(body.id, buildPayload(body), { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "Package updated", data: updated });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A package with this slug already exists" : undefined;
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
      return NextResponse.json({ success: false, message: "Missing package ID" }, { status: 400 }) as any;
    }

    const deleted = await Package.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "Package deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }) as any;
  }
}
