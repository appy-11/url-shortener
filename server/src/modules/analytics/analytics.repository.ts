/**
 * This file contains database operations for recording URL click events.
 *
 * Click events are persisted in PostgreSQL so they can be used later
 * for analytics and reporting.
 */

import { db } from '../../infrastructure/postgres/client.js'

// Creates a click event record for a shortened URL.
export const createClickEvent = async (urlId: bigint, clickedAt: Date): Promise<void> => {
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
}
