/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import CaseStudy from "@/models/CaseStudy";

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
    title: body.title,
    slug: body.slug ? createSlug(body.slug) : createSlug(body.title || ""),
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
    keywords: cleanArray(body.keywords),
    coverImage: body.coverImage,
    city: body.city,
    venue: body.venue || "",
    relatedServiceSlug: body.relatedServiceSlug || "",
    relatedLocationSlug: body.relatedLocationSlug || "",
    eventType: body.eventType,
    objective: body.objective,
    execution: body.execution,
    result: body.result,
    highlights: cleanArray(body.highlights),
    mediaUrls: cleanArray(body.mediaUrls),
    faqs: cleanFaqs(body.faqs),
    sortOrder: Number(body.sortOrder) || 0,
    isFeatured: body.isFeatured === true,
    isActive: body.isActive !== false,
    eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
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

    const items = await CaseStudy.find(filter).sort({ sortOrder: 1, eventDate: -1, title: 1 });
    return NextResponse.json({ success: true, data: slug ? items[0] || null : items });
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
    if (!payload.title || !payload.slug || !payload.metaTitle || !payload.metaDescription || !payload.coverImage || !payload.city || !payload.eventType || !payload.objective || !payload.execution || !payload.result) {
      return NextResponse.json({ success: false, message: "Missing required case study fields" }, { status: 400 }) as any;
    }

    const created = await CaseStudy.create(payload);
    return NextResponse.json({ success: true, message: "Case study created", data: created });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A case study with this slug already exists" : undefined;
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
      return NextResponse.json({ success: false, message: "Case study ID is required" }, { status: 400 }) as any;
    }

    const updated = await CaseStudy.findByIdAndUpdate(body.id, buildPayload(body), { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Case study not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "Case study updated", data: updated });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A case study with this slug already exists" : undefined;
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
      return NextResponse.json({ success: false, message: "Missing case study ID" }, { status: 400 }) as any;
    }

    const deleted = await CaseStudy.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Case study not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "Case study deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }) as any;
  }
}
