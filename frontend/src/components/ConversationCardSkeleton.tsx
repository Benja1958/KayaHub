export default function ConversationCardSkeleton() {
  return (
    <div className="flex max-w-full gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:gap-4 sm:p-4">
      <div className="h-16 w-16 shrink-0 animate-pulse sm:h-24 sm:w-28 rounded-xl bg-gray-200" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-24 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-4 w-12 shrink-0 animate-pulse rounded bg-gray-200 sm:w-16" />
        </div>

        <div className="mt-4 flex items-end justify-between gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-4 w-24 max-w-full animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div className="mt-3 h-4 w-24 max-w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}