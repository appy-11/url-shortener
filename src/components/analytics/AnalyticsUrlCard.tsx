/**
 * This component displays a card containing analytics information for a specific short URL.
 * It shows the short URL and its corresponding destination URL.
 * The component uses Tailwind CSS classes for styling and layout.
 * It is designed to be used within the AnalyticsPage to provide users with a quick overview of the short URL's details.
 */
import Card from '../ui/Card'

import { APP_CONFIG } from '@/config/app.config'
import type { ShortUrl } from '@/types/url'

interface AnalyticsUrlCardProps {
  url: ShortUrl
}

const AnalyticsUrlCard = ({ url }: AnalyticsUrlCardProps) => {
  return (
    <Card>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Short URL</p>

        <p className="mt-1 text-lg font-semibold break-all text-slate-900 dark:text-white">
          {APP_CONFIG.shortUrlDomain}/{url.shortCode}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">Destination</p>

        <a
          href={url.originalUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-sm break-all text-slate-700 hover:underline dark:text-slate-300"
        >
          {url.originalUrl}
        </a>
      </div>
    </Card>
  )
}

export default AnalyticsUrlCard
