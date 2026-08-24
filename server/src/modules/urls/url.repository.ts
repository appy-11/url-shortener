/**
 * This module provides functions for interacting with the database to manage URL records.
 * It includes functions to create new URL records and retrieve the next available URL ID.
 * The module uses the PostgreSQL client to execute SQL queries and map the results to the UrlRecord type.
 */
import { db } from '../../infrastructure/postgres/client.js'

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
  // Execute the SQL query to insert a new URL record into the database.
  const { rows } = await db.query(
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
    [record.id, record.shortCode, record.originalUrl, record.expiresAt],
  )

  // Map the first row of the result to a UrlRecord and return it.
  return mapUrlRecord(rows[0])
}

/**
 * Retrieves the next available URL ID from the database sequence.
 * @returns A promise resolving to the next URL ID as a bigint.
 * @throws An error if the ID generation fails.
 */
export const getNextUrlId = async (): Promise<bigint> => {
  const { rows } = await db.query<{ id: string }>(
    `
      SELECT nextval('urls_id_seq') AS id
    `,
  )

  const row = rows[0]

  if (!row) {
    throw new Error('Failed to generate URL ID')
  }

  return BigInt(row.id)
}
