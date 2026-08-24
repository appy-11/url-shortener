/**
 * UrlTable component for rendering a table of short URLs.
 * This component displays a list of short URLs in a tabular format with options to view each link.
 * It applies default styles for a consistent look and feel across the application.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'

import Button from '../ui/Button'

import { APP_CONFIG } from '@/config/app.config'
import type { ShortUrl } from '@/types/url'

interface UrlTableProps {
  urls: ShortUrl[]
}

const UrlTable = ({ urls }: UrlTableProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = async (url: ShortUrl) => {
    const shortUrl = `https://${APP_CONFIG.shortUrlDomain}/${url.shortCode}`

    await navigator.clipboard.writeText(shortUrl)

    setCopiedId(url.id)

    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <table className="w-full text-left">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              Short URL
            </th>

            <th className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              Destination
            </th>

            <th className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              Clicks
            </th>

            <th className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
              Status
            </th>

            <th className="px-6 py-4 text-right text-sm font-medium text-slate-600 dark:text-slate-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {urls.map((url) => (
            <tr
              key={url.id}
              className="transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <td className="px-6 py-4">
                <p className="font-medium text-slate-900 dark:text-white">
                  {APP_CONFIG.shortUrlDomain}/{url.shortCode}
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {new Date(url.createdAt).toLocaleDateString()}
                </p>
              </td>

              <td className="max-w-xs px-6 py-4">
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                  {url.originalUrl}
                </p>
              </td>

              <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                {url.clicks.toLocaleString()}
              </td>

              <td className="px-6 py-4">
                <span
                  className={
                    url.status === 'active'
                      ? 'rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400'
                      : 'rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-400'
                  }
                >
                  {url.status}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void handleCopy(url)}
                    className="px-3 py-2"
                  >
                    {copiedId === url.id ? 'Copied!' : 'Copy'}
                  </Button>

                  <Link to={`/links/${url.id}`}>
                    <Button type="button" className="px-3 py-2">
                      Analytics
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UrlTable
