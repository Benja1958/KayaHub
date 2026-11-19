"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import ListingForm from "@/components/ListingForm";
import Navbar from "@/components/Navbar";

import {
  createListing,
  ListingPayload,
} from "@/lib/landlordListings";

import {
  uploadListingImagesIndividually,
} from "@/lib/listingImages";

import {
  ImageIssue,
  toastUploadSummary,
} from "@/lib/image";

export default function NewListingPage() {
  const router = useRouter();

  async function handleCreate(
    payload: ListingPayload,
    images: File[],
    rejectedImages: ImageIssue[]
  ) {
    const listing =
      await createListing(payload);

    const { uploaded, failed } =
      await uploadListingImagesIndividually(
        listing.id,
        images
      );

    const issues = [
      ...rejectedImages,
      ...failed,
    ];

    toastUploadSummary(
      images.length +
        rejectedImages.length,
      uploaded.length,
      issues,
      "Property created successfully"
    );

    router.push("/landlord");
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/landlord"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Add New Property
        </h1>

        <p className="mt-2 text-gray-600">
          Add the property details and upload photos for tenants to view.
        </p>

        <div className="mt-8 rounded-xl border bg-white p-6">
          <ListingForm
            submitLabel="Create Listing"
            onSubmit={handleCreate}
            requireImages
          />
        </div>
      </main>
    </>
  );
}