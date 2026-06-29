/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import { defaultPackages } from "@/lib/package-defaults";
import Package from "@/models/Package";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const token = getAuthTokenFromHeader(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    for (const item of defaultPackages) {
      await Package.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true });
    }

    return NextResponse.json({ success: true, message: "Default packages seeded" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }) as any;
  }
}
