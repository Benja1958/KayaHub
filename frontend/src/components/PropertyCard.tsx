"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  House,
  MapPin,
} from "lucide-react";

import { Listing } from "@/types/listing";
import FavoriteButton from "@/components/FavoriteButton";
import { optimizeCloudinaryImage } from "@/lib/cloudinary";

type PropertyCardProps = {
  property: Listing;
};

/*
 * Compact, fixed-height card: every text line is a single line
 * (truncated) with a fixed line height, and the photo has a fixed
 * 3:2 ratio, so all cards in a row are the same height.
 * PropertyCardSkeleton mirrors these line heights.
 */
export default function PropertyCard({
  property,
}: PropertyCardProps) {
  const coverImage =
    property.images?.find(
      (image) => image.is_cover
    )?.image_url ??
    property.images?.[0]?.image_url ??
    property.image_url;

  const optimizedCoverImage =
    optimizeCloudinaryImage(
      coverImage,
      {
        width: 900,
        quality: "90",
      }
    );

  const [imageFailed, setImageFailed] =
    useState(false);

  const showImage =
    Boolean(optimizedCoverImage) &&
    !imageFailed;

  const isBedsitter =
    property.bedrooms === 0;

  const specsLabel = [
    isBedsitter
      ? "Bedsitter"
      : `${property.bedrooms} ${
          property.bedrooms === 1
            ? "bedroom"
            : "bedrooms"
        }`,
    `${property.bathrooms} ${
      property.bathrooms === 1
        ? "bathroom"
        : "bathrooms"
    }`,
  ].join(", ");

  return (
    <Link
      href={`/listings/${property.id}`}
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
        {showImage ? (
          <img
            src={optimizedCoverImage}
            alt={property.title}
            loading="lazy"
            decoding="async"
            onError={() =>
              setImageFailed(true)
            }
            // Catches images that failed before hydration, when onError wasn't attached yet.
            ref={(image) => {
              if (
                image?.complete &&
                image.naturalWidth === 0
              ) {
                setImageFailed(true);
              }
            }}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <House
              aria-hidden="true"
              className="h-10 w-10 text-slate-300"
            />
          </div>
        )}

        {property.is_verified_property && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-indigo-700 shadow-sm">
            <BadgeCheck
              aria-hidden="true"
              className="h-3.5 w-3.5 text-indigo-600"
            />
            Verified
          </span>
        )}

        <div
          className="absolute right-2.5 top-2.5"
          onClick={(event) =>
            event.preventDefault()
          }
        >
          <FavoriteButton
            listingId={property.id}
          />
        </div>
      </div>

      <div className="min-w-0 p-3 sm:p-3.5">
        <p className="flex items-baseline gap-1 overflow-hidden whitespace-nowrap leading-7">
          <span className="text-xl font-extrabold tracking-tight text-indigo-700">
            KES{" "}
            {property.monthly_rent.toLocaleString(
              "en-KE"
            )}
          </span>

          <span className="text-sm font-medium text-slate-500">
            /month
          </span>
        </p>

        <p
          role="img"
          aria-label={specsLabel}
          className="mt-1 flex items-center gap-2 whitespace-nowrap text-sm font-semibold leading-5 text-slate-800"
        >
          <span>
            {isBedsitter
              ? "Bedsitter"
              : `${property.bedrooms} bd`}
          </span>

          <span
            aria-hidden="true"
            className="h-3.5 w-px bg-slate-300"
          />

          <span>
            {property.bathrooms} ba
          </span>
        </p>

        <p className="mt-1 flex min-w-0 items-center gap-1 text-sm leading-5 text-slate-600">
          <MapPin
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
          />

          <span className="truncate">
            {property.location}
          </span>
        </p>

        <h2 className="mt-0.5 truncate text-[13px] leading-5 text-slate-400">
          {property.title}
        </h2>
      </div>
    </Link>
  );
}
