/**
 * This file handles asynchronous recording of URL click events.
 *
 * Instead of writing click data directly to the database during a request,
 * click events are added to the analytics queue and processed by a worker.
 */

import { findClickHistory } from '../urls/url.repository.js'
import { getUrlById } from '../urls/url.service.js'
import { UrlAnalytics } from '../urls/url.types.js'
import { analyticsQueue } from './analytics.queue.js'

// Adds a URL click event to the analytics queue for asynchronous processing.
export const recordClickAsync = async (urlId: bigint): Promise<void> => {
  await analyticsQueue.add(
    'url-click',
    {
      // Convert the URL ID to a string so it can be safely serialized in the job payload.
      urlId: urlId.toString(),

      // Record the exact time when the click event was created.
      clickedAt: new Date().toISOString(),
    },
    {
      // Remove the job from Redis after it has been processed successfully.
      removeOnComplete: true,

      // Keep failed jobs so they can be inspected or retried later.
      removeOnFail: false,
    },
  )
}

/**
 * Retrieves analytics data for a shortened URL.
 *
 * This includes the URL details, total click count, status, and
 * the historical click data grouped by day.
 *
 * @param id - The URL ID provided as a string, typically from a route parameter.
 * @returns The URL details and its click history.
 * @throws ApiError - Throws an error if the URL ID is invalid or the URL does not exist.
 */
export const getUrlAnalytics = async (id: string): Promise<UrlAnalytics> => {
  // Retrieve the URL details along with its total click count.
  const url = await getUrlById(id)

  // Retrieve the URL's click history grouped by date.
  const clickHistory = await findClickHistory(url.id)

  // Combine the URL details and click history into the analytics response.
  return {
    url,
    clickHistory,
  }
}
