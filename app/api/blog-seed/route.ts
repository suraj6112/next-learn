/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getAuthTokenFromHeader, verifyToken } from "@/lib/auth";
import { defaultBlogPosts } from "@/lib/blog-defaults";
import BlogPost from "@/models/BlogPost";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const token = getAuthTokenFromHeader(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 }) as any;
    }

    for (const post of defaultBlogPosts) {
      await BlogPost.updateOne(
        { slug: post.slug },
        { $setOnInsert: { ...post, publishedAt: new Date() } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: "Default blog posts seeded" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 }) as any;
  }
}
