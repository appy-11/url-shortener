/**
 * This is a skeleton component for the AnalyticsPage,
 * providing a loading state while the analytics data is being fetched.
 * It displays placeholder elements that mimic the layout of the actual analytics content,
 * including a title, description, and several cards representing analytics metrics.
 * The skeleton uses Tailwind CSS classes to create animated placeholders that give users visual
 * feedback that data is being loaded.
 *
 */
const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

      <div>
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
          />
        ))}
      </div>

      <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800" />
    </div>
  )
}

export default AnalyticsSkeleton
