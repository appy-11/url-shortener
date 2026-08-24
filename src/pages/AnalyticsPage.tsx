/**
 * This is the main page component for displaying analytics of a specific shortened URL.
 * It fetches the analytics data using the useUrlAnalytics hook and manages loading and error states.
 * The page displays a skeleton loader while data is being fetched, and shows an error message if the fetch fails.
 * Once the data is successfully fetched, it renders the AnalyticsUrlCard, AnalyticsStats, and ClicksChart components to present the analytics information.
 * The page also includes navigation links to return to the list of shortened URLs.
 */
import { Link, useParams } from 'react-router-dom'

import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'

import AnalyticsSkeleton from '@/components/analytics/AnalyticsSkeleton'
import AnalyticsStats from '@/components/analytics/AnalyticsStats'
import AnalyticsUrlCard from '@/components/analytics/AnalyticsUrlCard'
import ClicksChart from '@/components/analytics/ClicksChart'

import { useUrlAnalytics } from '../hooks/useUrlAnalytics'

const AnalyticsPage = () => {
  const { id } = useParams<{ id: string }>()

  const { analytics, isLoading, error, refetch } = useUrlAnalytics(id)

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {isLoading && <AnalyticsSkeleton />}

      {!isLoading && error && (
        <ErrorState
          title="Unable to load analytics"
          message={error}
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" onClick={() => void refetch()}>
                Try Again
              </Button>

              <Link to="/links">
                <Button type="button" variant="secondary" fullWidth>
                  Back to Links
                </Button>
              </Link>
            </div>
          }
        />
      )}

      {!isLoading && !error && analytics && (
        <>
          <Link
            to="/links"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Back to links
          </Link>

          <div className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              URL Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base dark:text-slate-400">
              Track how your shortened URL is performing.
            </p>
          </div>

          <div className="mt-8">
            <AnalyticsUrlCard url={analytics.url} />
          </div>

          <div className="mt-6">
            <AnalyticsStats url={analytics.url} />
          </div>

          <ClicksChart data={analytics.clickHistory} />
        </>
      )}
    </main>
  )
}

export default AnalyticsPage
