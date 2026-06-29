/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import SeoLocation from "@/models/SeoLocation";
import SeoService from "@/models/SeoService";
import { serviceLocations } from "@/lib/seo-locations";
import { servicePages } from "@/lib/seo-services";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const token = getAuthTokenFromHeader(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    for (const [index, service] of servicePages.entries()) {
      await SeoService.updateOne(
        { slug: service.slug },
        { $setOnInsert: { ...service, sortOrder: index, isActive: true } },
        { upsert: true }
      );
    }

    for (const [index, location] of serviceLocations.entries()) {
      await SeoLocation.updateOne(
        { slug: location.slug },
        { $setOnInsert: { ...location, sortOrder: index, isActive: true } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: "Default SEO services and locations seeded" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }) as any;
  }
}
