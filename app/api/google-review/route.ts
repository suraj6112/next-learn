import { NextResponse } from "next/server";

export function GET(request: Request) {
  const reviewUrl = process.env.GOOGLE_REVIEW_URL || process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL;
  const fallbackUrl = new URL("/reviews", request.url);

  return NextResponse.redirect(reviewUrl || fallbackUrl);
}
