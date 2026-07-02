export interface ClientCloudinaryUpload {
  url: string;
  thumbnailUrl?: string;
  resourceType?: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  resource_type?: string;
  bytes?: number;
  error?: {
    message?: string;
  };
}

interface CloudinaryUploadOptions {
  maxRetries?: number;
  timeoutMs?: number;
  onProgress?: (progress: number) => void;
  onRetry?: (attempt: number, error: Error) => void;
}

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getRetryDelay(attempt: number) {
  return Math.min(1000 * 2 ** attempt, 8000);
}

function parseCloudinaryResponse(responseText: string): CloudinaryUploadResponse {
  try {
    return JSON.parse(responseText) as CloudinaryUploadResponse;
  } catch {
    return {};
  }
}

function createUploadError(message: string, status?: number) {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
}

function uploadWithXhr(
  url: string,
  formData: FormData,
  timeoutMs: number,
  onProgress?: (progress: number) => void,
): Promise<ClientCloudinaryUpload> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", url);
    request.timeout = timeoutMs;

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    request.onload = () => {
      const result = parseCloudinaryResponse(request.responseText);
      if (request.status < 200 || request.status >= 300 || !result.secure_url) {
        reject(
          createUploadError(
            result.error?.message || `Cloudinary upload failed with status ${request.status}.`,
            request.status,
          ),
        );
        return;
      }

      resolve({
        url: result.secure_url,
        thumbnailUrl:
          result.resource_type === "video"
            ? result.secure_url.replace(/\.[^/.]+$/, ".jpg")
            : result.secure_url,
        resourceType: result.resource_type,
      });
      onProgress?.(100);
    };

    request.onerror = () => {
      reject(createUploadError("Network error while uploading to Cloudinary."));
    };

    request.ontimeout = () => {
      reject(createUploadError("Upload timed out. Please try again on a stable connection."));
    };

    request.send(formData);
  });
}

export async function uploadToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {},
): Promise<ClientCloudinaryUpload> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const maxRetries = options.maxRetries ?? 3;
  const timeoutMs = options.timeoutMs ?? 180000;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary direct upload env vars missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await uploadWithXhr(uploadUrl, formData, timeoutMs, options.onProgress);
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error("Cloudinary upload failed.");
      const status = (uploadError as Error & { status?: number }).status;
      const canRetry = !status || RETRYABLE_STATUS_CODES.has(status);

      lastError = uploadError;
      if (!canRetry || attempt === maxRetries) {
        break;
      }

      options.onRetry?.(attempt + 1, uploadError);
      await sleep(getRetryDelay(attempt));
    }
  }

  throw lastError || new Error("Cloudinary upload failed.");
}
