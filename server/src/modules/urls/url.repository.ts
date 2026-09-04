/**
 * This module provides functions for interacting with the database to manage URL records.
 * It includes functions to create new URL records and retrieve the next available URL ID.
 * The module uses the PostgreSQL client to execute SQL queries and map the results to the UrlRecord type.
 */
import { db } from '../../infrastructure/postgres/client.js'
import { ApiError } from '../../utils/api-error.js'

import type { ClickDataPoint, UrlListItem, UrlRecord } from './url.types.js'

/**
 * This interface defines the structure of a URL record that is used when creating a new URL entry in the database.
 * It includes the ID, short code, original URL, and optional expiration date.
 */
interface CreateUrlRecord {
  id: bigint
  shortCode: string
  originalUrl: string
  expiresAt: Date | null
}

interface UrlRow {
  id: string
  short_code: string
  original_url: string
  expires_at: Date | null
  created_at: Date
  updated_at: Date
  clicks?: number | string
}

/**
 * Maps a database row to a UrlRecord object.
 * @param row - The database row containing URL record data.
 * @returns A UrlRecord object with the mapped properties.
 */
const mapUrlRecord = (row: UrlRow): UrlRecord => {
  return {
    id: BigInt(row.id),
    shortCode: row.short_code,
    originalUrl: row.original_url,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Creates a new URL record in the database.
 * @param record - The URL record to create.
 * @returns A promise resolving to the created UrlRecord.
 */
export const createUrl = async (record: CreateUrlRecord): Promise<UrlRecord> => {
  // Acquire a client from the database connection pool
  const client = await db.connect()

  try {
    // Start a transaction to ensure atomicity of the operation
    await client.query('BEGIN')

    // Insert the new URL record into the database and return the inserted row
    const { rows } = await client.query<UrlRow>(
      `
        INSERT INTO urls (
          id,
          short_code,
          original_url,
          expires_at
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          short_code,
          original_url,
          expires_at,
          created_at,
          updated_at
      `,
      [record.id.toString(), record.shortCode, record.originalUrl, record.expiresAt],
    )

    // Check if the insertion was successful and retrieve the inserted row
    const row = rows[0]

    // If no row was returned, throw an error indicating the failure to create the URL
    if (!row) {
      throw new Error('Failed to create URL')
    }

    // Commit the transaction to finalize the insertion
    await client.query('COMMIT')

    // Map the inserted row to a UrlRecord and return it
    return mapUrlRecord(row)
  } catch (error) {
    // Rollback the transaction in case of an error to maintain database integrity
    await client.query('ROLLBACK')

    // Check if the error is a unique constraint violation (e.g., duplicate short code)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    ) {
      throw new ApiError(
        409,
        'CUSTOM_ALIAS_ALREADY_EXISTS',
        `The alias '${record.shortCode}' is already in use.`,
      )
    }

    throw error
  } finally {
    // Release the client back to the pool to avoid connection leaks
    client.release()
  }
}

/**
 * Retrieves the next available URL ID from the database sequence.
 * @returns A promise resolving to the next URL ID as a bigint.
 * @throws An error if the ID generation fails.
 */
export const getNextUrlId = async (): Promise<bigint> => {
  // Query the database to get the next value from the 'urls_id_seq' sequence
  const { rows } = await db.query<{ id: string }>(
    `
      SELECT nextval('urls_id_seq') AS id
    `,
  )

  // Check if a row was returned; if not, throw an error indicating the failure to generate a URL ID
  const row = rows[0]

  if (!row) {
    throw new Error('Failed to generate URL ID')
  }

  // Convert the ID from string to bigint and return it
  return BigInt(row.id)
}

/**
 * Finds a URL record in the database by its short code.
 * @param shortCode - The short code of the URL to find.
 * @returns A promise resolving to the UrlRecord if found, or null if not found.
 */
export const findUrlByShortCode = async (
  shortCode: string,
): Promise<UrlRecord | null> => {
  // Query the database to find a URL record matching the provided short code
  const { rows } = await db.query<UrlRow>(
    `
      SELECT
        id,
        short_code,
        original_url,
        expires_at,
        created_at,
        updated_at
      FROM urls
      WHERE short_code = $1
      LIMIT 1
    `,
    [shortCode],
  )

  const row = rows[0]

  if (!row) {
    return null
  }

  return mapUrlRecord(row)
}

/**
 * Retrieves all shortened URLs along with their total click count and status.
 *
 * A LEFT JOIN is used so URLs with no clicks are still included in the result.
 * The status is determined based on whether the URL has passed its expiry date.
 * @returns A promise which resolves to UrlListItem array
 *
 */

export const findAllUrls = async (): Promise<UrlListItem[]> => {
  const { rows } = await db.query<UrlRow>(`
    SELECT
      u.id,
      u.short_code,
      u.original_url,
      u.expires_at,
      u.created_at,
      u.updated_at,

      -- Count the number of click events associated with each URL.
      COUNT(ce.id)::int AS clicks

    FROM urls u

    -- Include URLs even when they have no click events.
    LEFT JOIN click_events ce
      ON ce.url_id = u.id

    -- Group results by URL so clicks can be counted for each URL.
    GROUP BY
      u.id,
      u.short_code,
      u.original_url,
      u.expires_at,
      u.created_at,
      u.updated_at

    -- Return the most recently created URLs first.
    ORDER BY u.created_at DESC
  `)

  // Map database rows into the application's URL list item format.
  return rows.map((row) => ({
    ...mapUrlRecord(row),

    // Convert the database click count into a JavaScript number.
    clicks: Number(row.clicks),

    // Mark the URL as expired when its expiry date has passed.
    // URLs without an expiry date are considered active.
    status:
      row.expires_at && new Date(row.expires_at) <= new Date() ? 'expired' : 'active',
  }))
}

/**
 *
 * It retrieves the click history for a URL and groups click events
 * by day using UTC dates.
 * @param urlId The id of the utl
 * @returns The promise which resolves to ClickDataPoint of the requested url
 */

export const findClickHistory = async (urlId: bigint): Promise<ClickDataPoint[]> => {
  const { rows } = await db.query<{
    date: string
    clicks: number
  }>(
    `
      SELECT
        TO_CHAR(
          clicked_at AT TIME ZONE 'UTC',
          'YYYY-MM-DD'
        ) AS date,

        -- Count all click events that occurred on each day.
        COUNT(*)::int AS clicks

      FROM click_events

      -- Only retrieve click events belonging to the requested URL.
      WHERE url_id = $1

      -- Group click events by their UTC calendar date.
      GROUP BY
        TO_CHAR(
          clicked_at AT TIME ZONE 'UTC',
          'YYYY-MM-DD'
        )

      -- Return the oldest dates first to maintain chronological order.
      ORDER BY date ASC
    `,
    // Convert the bigint URL ID to a string before passing it to PostgreSQL.
    [urlId.toString()],
  )

  // Map database rows into the application's analytics data-point format.
  return rows.map((row) => ({
    date: row.date,
    clicks: Number(row.clicks),
  }))
}

/**
 * Retrieves a shortened URL by its ID along with its total click count and status.
 *
 * @param id - The unique ID of the shortened URL to retrieve.
 * @returns The URL details with click count and status, or null if the URL does not exist.
 */
export const findUrlByIdWithClicks = async (id: bigint): Promise<UrlListItem | null> => {
  const { rows } = await db.query<UrlRow>(
    `
    SELECT
      u.id,
      u.short_code,
      u.original_url,
      u.expires_at,
      u.created_at,
      u.updated_at,
      COUNT(ce.id)::int AS clicks
    FROM urls u
    LEFT JOIN click_events ce
      ON ce.url_id = u.id
    WHERE u.id = $1
    GROUP BY
      u.id,
      u.short_code,
      u.original_url,
      u.expires_at,
      u.created_at,
      u.updated_at
  `,
    [id.toString()],
  )

  const row = rows[0]

  if (!row) {
    return null
  }

  return {
    ...mapUrlRecord(row),
    clicks: Number(row.clicks),
    status:
      row.expires_at && new Date(row.expires_at) <= new Date() ? 'expired' : 'active',
  }
}
