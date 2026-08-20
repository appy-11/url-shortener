/**
 * This component displays key analytics statistics for a specific short URL,
 * including total clicks, creation date, status, and expiration date.
 * It uses the Card component for consistent styling and layout,
 * and Tailwind CSS classes for visual presentation.
 * The component receives a ShortUrl object as a prop, which contains
 * the necessary data to display the analytics information.
 */
import Card from '../ui/Card'

import type { ShortUrl } from '@/types/url'

interface AnalyticsStatsProps {
  url: ShortUrl
}

const AnalyticsStats = ({ url }: AnalyticsStatsProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <p className="text-sm text-slate-500">Total Clicks</p>

        <p className="mt-2 text-3xl font-bold text-slate-900">
          {url.clicks.toLocaleString()}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">Created</p>

        <p className="mt-2 text-lg font-semibold text-slate-900">
          {new Date(url.createdAt).toLocaleDateString()}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">Status</p>

        <div className="mt-2">
          <span
            className={
              url.status === 'active'
                ? 'rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700'
                : 'rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700'
            }
          >
            {url.status}
          </span>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-slate-500">Expires</p>

        <p className="mt-2 text-lg font-semibold text-slate-900">
          {url.expiresAt ? new Date(url.expiresAt).toLocaleDateString() : 'Never'}
        </p>
      </Card>
    </div>
  )
}

export default AnalyticsStats
