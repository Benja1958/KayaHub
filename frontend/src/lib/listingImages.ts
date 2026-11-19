import { authFetch } from "@/lib/authFetch";
import {
  getUploadErrorMessage,
  ImageIssue,
  toUploadNetworkError,
} from "@/lib/image";
import { ListingImage } from "@/types/listing";

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      return data.detail;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export async function uploadListingImages(
  listingId: number,
  files: File[]
): Promise<ListingImage[]> {
  if (files.length === 0) {
    throw new Error("Select at least one image");
  }

  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  let response: Response;

  try {
    response = await authFetch(
      `/backend-api/listings/${listingId}/images`,
      {
        method: "POST",
        body: formData,
      }
    );
  } catch (error) {
    throw toUploadNetworkError(error);
  }

  if (!response.ok) {
    throw new Error(
      await getUploadErrorMessage(
        response,
        "Failed to upload image. Please try again."
      )
    );
  }

  return response.json();
}

/**
 * Uploads files one request at a time, in order, so one failure
 * doesn't cancel the rest. The first upload to a listing without
 * images still becomes the cover, as before.
 */
export async function uploadListingImagesIndividually(
  listingId: number,
  files: File[]
): Promise<{
  uploaded: ListingImage[];
  failed: ImageIssue[];
}> {
  const uploaded: ListingImage[] = [];
  const failed: ImageIssue[] = [];

  for (const file of files) {
    try {
      uploaded.push(
        ...(await uploadListingImages(
          listingId,
          [file]
        ))
      );
    } catch (error) {
      // Session expired: authFetch is already redirecting to login.
      if (
        error instanceof Error &&
        error.message === "UNAUTHORIZED"
      ) {
        throw error;
      }

      failed.push({
        fileName: file.name,
        reason:
          error instanceof Error
            ? error.message
            : "Failed to upload image. Please try again.",
      });
    }
  }

  return { uploaded, failed };
}

export async function deleteListingImage(
  listingId: number,
  imageId: number
): Promise<void> {
  const response = await authFetch(
    `/backend-api/listings/${listingId}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to delete image"
      )
    );
  }
}

export async function setListingCoverImage(
  listingId: number,
  imageId: number
): Promise<ListingImage> {
  const response = await authFetch(
    `/backend-api/listings/${listingId}/images/${imageId}/cover`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to set cover image"
      )
    );
  }

  return response.json();
}
