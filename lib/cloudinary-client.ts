export interface ClientCloudinaryUpload {
  url: string;
  thumbnailUrl?: string;
  resourceType?: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  resource_type?: string;
  error?: {
    message?: string;
  };
}

export async function uploadToCloudinary(file: File): Promise<ClientCloudinaryUpload> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary direct upload env vars missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || "Cloudinary upload failed.");
  }

  return {
    url: result.secure_url,
    thumbnailUrl: result.resource_type === "video" ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") : result.secure_url,
    resourceType: result.resource_type,
  };
}
