import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@skysfx.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminSfxPass2026";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = signToken({ email, role: "admin" });
      return NextResponse.json({
        success: true,
        token,
        message: "Logged in successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    ) as any;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    ) as any;
  }
}
