/**
 * This file handles asynchronous recording of URL click events.
 *
 * Instead of writing click data directly to the database during a request,
 * click events are added to the analytics queue and processed by a worker.
 */

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
