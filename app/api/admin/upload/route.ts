import { NextResponse } from "next/server";
import { verifyToken, getAuthTokenFromHeader } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    // 1. Verify Authorization
    const token = getAuthTokenFromHeader(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      ) as any;
    }

    // 2. Read Multipart Form Data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file was selected for upload" },
        { status: 400 }
      ) as any;
    }

    // 3. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary using Promise wrapper
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "sky-sfx-gallery",
          resource_type: "auto", // Auto detect image or video
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const result = uploadResult as any;

    return NextResponse.json({
      success: true,
      message: "Media uploaded successfully to Cloudinary!",
      url: result.secure_url,
      thumbnailUrl: result.resource_type === "video" ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") : result.secure_url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload file" },
      { status: 500 }
    ) as any;
  }
}
