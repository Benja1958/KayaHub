import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">
      <div>
        <div className="h-9 w-72 animate-pulse rounded bg-gray-200" />

        <div className="mt-3 h-5 w-60 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="mt-8 h-24 animate-pulse rounded-xl bg-gray-100" />

      <div className="mt-6 h-4 w-40 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}