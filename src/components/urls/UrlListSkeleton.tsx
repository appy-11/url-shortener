/**
 * A skeleton component for displaying a loading state for a list of URLs.
 */
const UrlListSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="hidden md:block">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex gap-6 border-b border-slate-100 px-6 py-5 dark:border-slate-800"
          >
            <div className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="h-5 flex-1 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="h-5 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="h-5 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      <div className="space-y-4 p-4 md:hidden">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
          >
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-3 h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UrlListSkeleton
