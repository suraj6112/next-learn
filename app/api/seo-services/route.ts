/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import SeoService from "@/models/SeoService";

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
  const slug = body.slug ? createSlug(body.slug) : createSlug(body.shortTitle || body.title || "");
  return {
    slug,
    title: body.title,
    shortTitle: body.shortTitle,
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
    keywords: cleanArray(body.keywords),
    category: body.category,
    heroImage: body.heroImage,
    intro: body.intro,
    highlights: cleanArray(body.highlights),
    process: cleanArray(body.process),
    faqs: cleanFaqs(body.faqs),
    sortOrder: Number(body.sortOrder) || 0,
    isActive: body.isActive !== false,
  };
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const filter = includeInactive ? {} : { isActive: true };
    const services = await SeoService.find(filter).sort({ sortOrder: 1, title: 1 });
    return NextResponse.json({ success: true, data: services });
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
    if (!payload.title || !payload.shortTitle || !payload.slug || !payload.metaTitle || !payload.metaDescription || !payload.category || !payload.heroImage || !payload.intro) {
      return NextResponse.json({ success: false, message: "Missing required SEO service fields" }, { status: 400 }) as any;
    }

    const service = await SeoService.create(payload);
    return NextResponse.json({ success: true, message: "SEO service created", data: service });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A SEO service with this slug already exists" : undefined;
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
      return NextResponse.json({ success: false, message: "SEO service ID is required" }, { status: 400 }) as any;
    }

    const updated = await SeoService.findByIdAndUpdate(body.id, buildPayload(body), { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "SEO service not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "SEO service updated", data: updated });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A SEO service with this slug already exists" : undefined;
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
      return NextResponse.json({ success: false, message: "Missing SEO service ID" }, { status: 400 }) as any;
    }

    const deleted = await SeoService.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "SEO service not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "SEO service deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }) as any;
  }
}
