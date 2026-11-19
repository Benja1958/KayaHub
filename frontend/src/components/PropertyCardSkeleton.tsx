/* Mirrors PropertyCard: 3:2 photo, then price, specs, location and title lines. */
export default function PropertyCardSkeleton() {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[3/2] w-full animate-pulse bg-gray-200" />

      <div className="p-3 sm:p-3.5">
        <div className="flex h-7 items-center">
          <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-1 flex h-5 items-center">
          <div className="h-3.5 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-1 flex h-5 items-center">
          <div className="h-3.5 w-40 max-w-full animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-0.5 flex h-5 items-center">
          <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
