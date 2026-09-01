/**
 * Integration tests for the analytics worker processor.
 *
 * These tests verify that a queued analytics job is correctly converted
 * into a PostgreSQL click event.
 *
 * PostgreSQL is intentionally used as a real dependency here because
 * the purpose of this test is to verify the integration between the
 * worker processor and the database repository.
 *
 * Redis/BullMQ itself is not started by these tests because the queue
 * transport is already tested separately. We are testing the processing
 * logic that runs when a BullMQ job reaches the worker.
 */
import { afterAll, afterEach, describe, expect, it } from 'vitest'

import { db } from '../../infrastructure/postgres/client.js'

import { processAnalyticsJob } from './analytics.worker.js'

describe('Analytics worker', () => {
  /**
   * Keep track of URLs created during the tests so they can be removed
   * after each test.
   */
  const createdUrlIds: bigint[] = []

  /**
   * Remove test data after every test.
   *
   * click_events has an ON DELETE CASCADE relationship with urls,
   * so deleting the URL also removes its click events.
   */
  afterEach(async () => {
    for (const id of createdUrlIds) {
      await db.query(
        `
          DELETE FROM urls
          WHERE id = $1
        `,
        [id.toString()],
      )
    }

    createdUrlIds.length = 0
  })

  /**
   * Close the PostgreSQL pool when all worker tests have completed.
   */
  afterAll(async () => {
    await db.end()
  })

  describe('processAnalyticsJob', () => {
    /**
     * Verifies that a queued click event is persisted correctly
     * in PostgreSQL.
     */
    it('creates a click event from a queue job', async () => {
      /**
       * Create a real URL record that the click event can reference.
       */
      const { rows } = await db.query<{ id: string }>(
        `SELECT nextval('urls_id_seq') AS id`,
      )

      const row = rows[0]

      if (!row) {
        throw new Error('Failed to generate test URL ID')
      }

      const urlId = BigInt(row.id)

      createdUrlIds.push(urlId)

      await db.query(
        `
          INSERT INTO urls (
            id,
            short_code,
            original_url,
            expires_at
          )
          VALUES ($1, $2, $3, $4)
        `,
        [
          urlId.toString(),
          `worker-${Date.now()}`,
          'https://example.com/worker-test',
          null,
        ],
      )

      /**
       * This represents the data that BullMQ would provide to the worker.
       *
       * Notice that both urlId and clickedAt are strings because that
       * is how they are stored in the queue payload.
       */
      const clickedAt = '2026-08-25T10:30:00.000Z'

      const job = {
        data: {
          urlId: urlId.toString(),
          clickedAt,
        },
      }

      /**
       * Process the simulated BullMQ job.
       */
      await processAnalyticsJob(job)

      /**
       * Verify that the worker created the click event in PostgreSQL.
       */
      const { rows: clickRows } = await db.query<{
        url_id: string
        clicked_at: Date
      }>(
        `
          SELECT
            url_id,
            clicked_at
          FROM click_events
          WHERE url_id = $1
        `,
        [urlId.toString()],
      )

      expect(clickRows).toHaveLength(1)

      const clickRow = clickRows[0]

      if (!clickRow) {
        throw new Error('Click event was not created')
      }

      /**
       * Verify that the URL ID was converted from the queue's string
       * representation back to the correct database value.
       */
      expect(BigInt(clickRow.url_id)).toBe(urlId)

      /**
       * Verify that the timestamp from the queue was persisted correctly.
       */
      expect(clickRow.clicked_at.toISOString()).toBe(clickedAt)
    })

    /**
     * Verifies that multiple queue jobs produce multiple click events.
     *
     * This is important because every redirect should result in its own
     * analytics event.
     */
    it('creates separate click events for separate jobs', async () => {
      const { rows } = await db.query<{ id: string }>(
        `SELECT nextval('urls_id_seq') AS id`,
      )

      const row = rows[0]

      if (!row) {
        throw new Error('Failed to generate test URL ID')
      }

      const urlId = BigInt(row.id)

      createdUrlIds.push(urlId)

      await db.query(
        `
          INSERT INTO urls (
            id,
            short_code,
            original_url,
            expires_at
          )
          VALUES ($1, $2, $3, $4)
        `,
        [
          urlId.toString(),
          `worker-multiple-${Date.now()}`,
          'https://example.com/worker-multiple-test',
          null,
        ],
      )

      /**
       * Simulate two independent click events for the same URL.
       */
      await processAnalyticsJob({
        data: {
          urlId: urlId.toString(),
          clickedAt: '2026-08-25T10:00:00.000Z',
        },
      })

      await processAnalyticsJob({
        data: {
          urlId: urlId.toString(),
          clickedAt: '2026-08-25T11:00:00.000Z',
        },
      })

      /**
       * The database should contain two independent click events.
       */
      const { rows: clickRows } = await db.query<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM click_events
          WHERE url_id = $1
        `,
        [urlId.toString()],
      )

      expect(clickRows[0]?.count).toBe('2')
    })

    /**
     * Verifies that an invalid URL ID causes the processor to reject
     * the job rather than silently writing incorrect analytics data.
     */
    it('rejects jobs with an invalid URL ID', async () => {
      await expect(
        processAnalyticsJob({
          data: {
            urlId: 'not-a-number',
            clickedAt: '2026-08-25T10:00:00.000Z',
          },
        }),
      ).rejects.toThrow()
    })
  })
})
