/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import HomeStat from "@/models/HomeStat";

const DEFAULT_HOME_STATS = [
  { key: "events-completed", label: "Events Completed", value: 100, suffix: "+", sortOrder: 1, isActive: true },
  { key: "happy-clients", label: "Happy Clients", value: 500, suffix: "+", sortOrder: 2, isActive: true },
  { key: "premium-fire-shows", label: "Premium Fire Shows", value: 50, suffix: "+", sortOrder: 3, isActive: true },
  { key: "years-experience", label: "Years Experience", value: 5, suffix: "+", sortOrder: 4, isActive: true },
];

function isAuthorized(request: Request) {
  const token = getAuthTokenFromHeader(request.headers);
  return !!token && !!verifyToken(token);
}

function normalizeStats(stats: any[] = [], includeInactive = false) {
  return stats
    .filter((item) => includeInactive || item.isActive !== false)
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0))
    .map((item, index) => ({
      key: String(item.key || `stat-${index + 1}`).trim(),
      label: String(item.label || "").trim(),
      value: Number(item.value) || 0,
      suffix: String(item.suffix ?? "+").trim(),
      sortOrder: Number(item.sortOrder) || index + 1,
      isActive: item.isActive !== false,
    }));
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const homeStats = await HomeStat.findOne({ sectionKey: "home" }).lean();
    const stats = homeStats?.stats?.length ? homeStats.stats : DEFAULT_HOME_STATS;

    return NextResponse.json({ success: true, data: normalizeStats(stats, includeInactive) });
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
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    const { stats } = await request.json();
    if (!Array.isArray(stats) || stats.length === 0) {
      return NextResponse.json({ success: false, message: "At least one stat is required" }, { status: 400 }) as any;
    }

    const cleanStats = normalizeStats(stats, true).filter((item) => item.label);
    if (cleanStats.length === 0) {
      return NextResponse.json({ success: false, message: "Stat label is required" }, { status: 400 }) as any;
    }

    const updated = await HomeStat.findOneAndUpdate(
      { sectionKey: "home" },
      { sectionKey: "home", stats: cleanStats },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, message: "Home stats updated successfully", data: updated.stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
