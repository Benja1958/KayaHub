export default function ConversationPageSkeleton() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <header className="border-b border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <div className="h-14 w-16 shrink-0 animate-pulse rounded-xl bg-gray-200 sm:h-16 sm:w-20" />

              <div className="min-w-0 flex-1">
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />

                <div className="mt-2 h-4 w-32 max-w-full animate-pulse rounded bg-gray-200" />

                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:block">
              <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />

              <div className="h-3 w-12 animate-pulse rounded bg-gray-200 sm:mt-2 sm:ml-auto" />
            </div>
          </div>

          <div className="mt-4 ml-auto h-4 w-28 animate-pulse rounded bg-gray-200" />
        </header>

        <div className="min-h-[520px] p-4 sm:p-5">
          <div className="space-y-5">
            <div className="flex justify-start">
              <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-gray-200" />
            </div>

            <div className="flex justify-end">
              <div className="h-20 w-1/2 animate-pulse rounded-2xl bg-gray-200" />
            </div>

            <div className="flex justify-start">
              <div className="h-14 w-3/5 animate-pulse rounded-2xl bg-gray-200" />
            </div>

            <div className="flex justify-end">
              <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-gray-200 p-3 sm:gap-3 sm:p-4">
          <div className="h-12 min-w-0 flex-1 animate-pulse rounded-xl bg-gray-200" />

          <div className="h-12 w-20 shrink-0 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </main>
  );
}
