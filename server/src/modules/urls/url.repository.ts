/**
 * This module provides functions for interacting with the database to manage URL records.
 * It includes functions to create new URL records and retrieve the next available URL ID.
 * The module uses the PostgreSQL client to execute SQL queries and map the results to the UrlRecord type.
 */
import { db } from '../../infrastructure/postgres/client.js'
import { ApiError } from '../../utils/api-error.js'

import type { UrlRecord } from './url.types.js'

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

/**
 * Maps a database row to a UrlRecord object.
 * @param row - The database row containing URL record data.
 * @returns A UrlRecord object with the mapped properties.
 */
const mapUrlRecord = (row: Record<string, unknown>): UrlRecord => {
  return {
    id: BigInt(row.id as string),
    shortCode: row.short_code as string,
    originalUrl: row.original_url as string,
    expiresAt: row.expires_at as Date | null,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
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
    const { rows } = await client.query(
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
