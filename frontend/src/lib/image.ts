/*
 * Shared image preparation for uploads: type check, client-side
 * compression and size limits. Keep the limits in sync with
 * backend/app/utils/image_upload.py.
 *
 * The existing low-resolution check (lib/imageValidation.ts) runs on
 * the ORIGINAL file when it is selected, before anything here runs.
 */

import { toast } from "sonner";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

/* Largest file the server accepts. */
export const MAX_UPLOAD_BYTES =
  10 * 1024 * 1024;

/* Larger files are rejected before decoding so low-end phones don't run out of memory. */
export const MAX_SOURCE_IMAGE_BYTES =
  25 * 1024 * 1024;

/*
 * Longest side after compression. Never upscaled.
 * Listing photos: 2048 keeps typical landscape and 3:4 / 2:3
 * portrait phone photos at or above the 1200 × 800 low-resolution
 * threshold (e.g. 4:3 → 2048 × 1536, 3:4 → 1536 × 2048).
 * Profile photos are shown at ~112px, so 800 is plenty.
 */
export const LISTING_IMAGE_MAX_DIMENSION = 2048;
export const PROFILE_IMAGE_MAX_DIMENSION = 800;

export const DEFAULT_JPEG_QUALITY = 0.82;

export const UNSUPPORTED_IMAGE_MESSAGE =
  "Please upload a JPG, PNG or WebP image.";

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

export type ImageIssue = {
  fileName: string;
  reason: string;
};

type CompressOptions = {
  maxDimension?: number;
  quality?: number;
};

function formatMegabytes(
  bytes: number
): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toJpegName(
  name: string
): string {
  const base =
    name.replace(/\.[^./]+$/, "") ||
    "image";

  return `${base}.jpg`;
}

/**
 * Shrinks an image so its longest side is at most `maxDimension`
 * and re-encodes it as JPEG. Returns the original file when it isn't
 * an image, can't be decoded by this browser (e.g. HEIC in Chrome),
 * or when compression wouldn't make it smaller.
 *
 * Throws ImageUploadError for files over 25 MB, before decoding.
 */
export async function compressImage(
  file: File,
  {
    maxDimension = LISTING_IMAGE_MAX_DIMENSION,
    quality = DEFAULT_JPEG_QUALITY,
  }: CompressOptions = {}
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new ImageUploadError(
      `This file is ${formatMegabytes(
        file.size
      )}. Please choose a photo under 25 MB.`
    );
  }

  if (
    typeof createImageBitmap !==
    "function"
  ) {
    return file;
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(
      file,
      {
        imageOrientation:
          "from-image",
      }
    );
  } catch {
    return file;
  }

  const canvas =
    document.createElement("canvas");

  try {
    const scale = Math.min(
      1,
      maxDimension /
        Math.max(
          bitmap.width,
          bitmap.height
        )
    );

    canvas.width = Math.max(
      1,
      Math.round(bitmap.width * scale)
    );

    canvas.height = Math.max(
      1,
      Math.round(bitmap.height * scale)
    );

    const context =
      canvas.getContext("2d");

    if (!context) {
      return file;
    }

    // JPEG has no transparency, so give PNG/WebP a white background.
    context.fillStyle = "#ffffff";
    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.drawImage(
      bitmap,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const blob =
      await new Promise<Blob | null>(
        (resolve) =>
          canvas.toBlob(
            resolve,
            "image/jpeg",
            quality
          )
      );

    if (
      !blob ||
      blob.size >= file.size
    ) {
      return file;
    }

    return new File(
      [blob],
      toJpegName(file.name),
      {
        type: "image/jpeg",
        lastModified:
          file.lastModified,
      }
    );
  } finally {
    bitmap.close();

    // Release the canvas backing memory straight away.
    canvas.width = 0;
    canvas.height = 0;
  }
}

/* Checks the file's real format from its first bytes, not just its name. */
async function hasAllowedImageSignature(
  file: File
): Promise<boolean> {
  const header = new Uint8Array(
    await file
      .slice(0, 12)
      .arrayBuffer()
  );

  const startsWith = (
    bytes: number[],
    offset = 0
  ) =>
    bytes.every(
      (byte, index) =>
        header[offset + index] === byte
    );

  const isJpeg = startsWith([
    0xff, 0xd8, 0xff,
  ]);

  const isPng = startsWith([
    0x89, 0x50, 0x4e, 0x47,
    0x0d, 0x0a, 0x1a, 0x0a,
  ]);

  const isWebp =
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    startsWith(
      [0x57, 0x45, 0x42, 0x50],
      8
    );

  return isJpeg || isPng || isWebp;
}

/**
 * Type check → compress → size check for one file.
 * Throws ImageUploadError with a user-facing reason.
 */
export async function prepareImageForUpload(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    ) ||
    !(await hasAllowedImageSignature(
      file
    ))
  ) {
    throw new ImageUploadError(
      UNSUPPORTED_IMAGE_MESSAGE
    );
  }

  const prepared =
    await compressImage(file, options);

  if (
    prepared.size > MAX_UPLOAD_BYTES
  ) {
    throw new ImageUploadError(
      `This image is ${formatMegabytes(
        prepared.size
      )} even after compression. The maximum size is 10 MB.`
    );
  }

  return prepared;
}

/**
 * Prepares each file independently, one at a time to limit memory use.
 * One bad file never stops the others.
 */
export async function prepareImagesForUpload(
  files: File[],
  options: CompressOptions = {}
): Promise<{
  ready: File[];
  rejected: ImageIssue[];
}> {
  const ready: File[] = [];
  const rejected: ImageIssue[] = [];

  for (const file of files) {
    try {
      ready.push(
        await prepareImageForUpload(
          file,
          options
        )
      );
    } catch (error) {
      rejected.push({
        fileName: file.name,
        reason:
          error instanceof Error
            ? error.message
            : "This image couldn't be processed.",
      });
    }
  }

  return { ready, rejected };
}

export function describeImageIssue(
  issue: ImageIssue
): string {
  return `${issue.fileName} couldn't be used: ${issue.reason}`;
}

/* e.g. "2 of 3 uploaded. photo3.heic couldn't be used: <reason>" */
export function formatUploadSummary(
  total: number,
  uploadedCount: number,
  issues: ImageIssue[]
): string {
  return [
    `${uploadedCount} of ${total} uploaded.`,
    ...issues.map(describeImageIssue),
  ].join(" ");
}

/**
 * One toast for a batch: success if everything uploaded, a warning
 * listing what failed if some did, an error if nothing did.
 */
export function toastUploadSummary(
  total: number,
  uploadedCount: number,
  issues: ImageIssue[],
  successMessage: string
): void {
  if (issues.length === 0) {
    toast.success(successMessage);
    return;
  }

  const summary = formatUploadSummary(
    total,
    uploadedCount,
    issues
  );

  if (uploadedCount === 0) {
    toast.error(summary);
  } else {
    toast.warning(summary);
  }
}

/**
 * Builds a readable error from a failed upload response, preferring the
 * backend's `detail`. Copes with non-JSON bodies (e.g. a proxy error page).
 */
export async function getUploadErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data =
      await response.json();

    if (
      typeof data?.detail ===
      "string"
    ) {
      return data.detail;
    }
  } catch {
    // Not JSON; fall through to status-based messages.
  }

  if (response.status === 413) {
    return "Image is too large. The maximum size is 10 MB.";
  }

  if (response.status === 415) {
    return UNSUPPORTED_IMAGE_MESSAGE;
  }

  return fallback;
}

/* "Failed to fetch" means no response at all, usually a network problem. */
export function toUploadNetworkError(
  error: unknown
): Error {
  if (
    error instanceof TypeError
  ) {
    return new Error(
      "Couldn't reach the server. Check your connection and try again."
    );
  }

  return error instanceof Error
    ? error
    : new Error(
        "Failed to upload image. Please try again."
      );
}
