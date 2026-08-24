/**
 * A card component that displays information about a shortened URL,
 * including its original URL, short code, status, click count,
 * and creation date. It also provides buttons to copy the short URL to the
 * clipboard and navigate to the analytics page for the URL.
 * This component is designed to be used for the mobile view of the application,
 * providing a compact and user-friendly interface for managing shortened URLs.
 * @param url - The shortened URL object containing details such as the original URL,
 * short code, status, click count, and creation date.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../ui/Button'
import Card from '../ui/Card'

import { APP_CONFIG } from '@/config/app.config'
import type { ShortUrl } from '@/types/url'

interface UrlCardProps {
  url: ShortUrl
}

const UrlCard = ({ url }: UrlCardProps) => {
  const [copied, setCopied] = useState(false)

  const shortUrl = `https://${APP_CONFIG.shortUrlDomain}/${url.shortCode}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {APP_CONFIG.shortUrlDomain}/{url.shortCode}
          </p>

          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
            {url.originalUrl}
          </p>
        </div>

        <span
          className={
            url.status === 'active'
              ? 'shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400'
              : 'shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-400'
          }
        >
          {url.status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-y border-slate-100 py-4 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Clicks</p>

          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {url.clicks.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Created</p>

          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {new Date(url.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => void handleCopy()}
          className="flex-1"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>

        <Link to={`/links/${url.id}`} className="flex-1">
          <Button type="button" fullWidth>
            Analytics
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default UrlCard
