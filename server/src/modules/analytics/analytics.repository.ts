/**
 * This file contains database operations for recording URL click events.
 *
 * Click events are persisted in PostgreSQL so they can be used later
 * for analytics and reporting.
 */

import { db } from '../../infrastructure/postgres/client.js'

/**
 * Error thrown when a click event references a URL that does not exist.
 *
 * This is a permanent error because retrying the same analytics job
 * will not succeed unless the referenced URL is recreated.
 */
export class UrlNotFoundError extends Error {
  constructor(urlId: bigint) {
    super(`Cannot record click event: URL '${urlId}' does not exist.`)

    this.name = 'UrlNotFoundError'
  }
}

// Creates a click event record for a shortened URL.
export const createClickEvent = async (urlId: bigint, clickedAt: Date): Promise<void> => {
  try {
    await db.query(
      `
        INSERT INTO click_events (
          url_id,
          clicked_at
        )
        VALUES ($1, $2)
      `,
      // Convert the bigint URL ID to a string before sending it to PostgreSQL.
      [urlId.toString(), clickedAt],
    )
  } catch (error) {
    /**
     * PostgreSQL error code 23503 represents a foreign-key violation.
     *
     * In this case it means that the URL referenced by urlId does not
     * exist in the urls table. Retrying the job would not fix this.
     */
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23503'
    ) {
      throw new UrlNotFoundError(urlId)
    }

    // Re-throw all other database errors so BullMQ can retry them.
    throw error
  }
}
