/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { createSlug } from "@/lib/slug";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import SeoLocation from "@/models/SeoLocation";

function isAuthorized(request: Request) {
  const token = getAuthTokenFromHeader(request.headers);
  return !!token && !!verifyToken(token);
}

function cleanArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function buildPayload(body: any) {
  return {
    slug: body.slug ? createSlug(body.slug) : createSlug(body.city || ""),
    city: body.city,
    region: body.region,
    state: body.state,
    serviceAreas: cleanArray(body.serviceAreas),
    intro: body.intro,
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
    const locations = await SeoLocation.find(filter).sort({ sortOrder: 1, city: 1 });
    return NextResponse.json({ success: true, data: locations });
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
    if (!payload.city || !payload.slug || !payload.region || !payload.state || !payload.intro) {
      return NextResponse.json({ success: false, message: "Missing required SEO location fields" }, { status: 400 }) as any;
    }

    const location = await SeoLocation.create(payload);
    return NextResponse.json({ success: true, message: "SEO location created", data: location });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A SEO location with this slug already exists" : undefined;
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
      return NextResponse.json({ success: false, message: "SEO location ID is required" }, { status: 400 }) as any;
    }

    const updated = await SeoLocation.findByIdAndUpdate(body.id, buildPayload(body), { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "SEO location not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "SEO location updated", data: updated });
  } catch (error: any) {
    const duplicateMessage = error.code === 11000 ? "A SEO location with this slug already exists" : undefined;
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
      return NextResponse.json({ success: false, message: "Missing SEO location ID" }, { status: 400 }) as any;
    }

    const deleted = await SeoLocation.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "SEO location not found" }, { status: 404 }) as any;
    }

    return NextResponse.json({ success: true, message: "SEO location deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }) as any;
  }
}
