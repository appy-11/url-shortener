/**
 * Unit tests for the analytics service.
 *
 * These tests focus on the analytics queue producer. The actual BullMQ
 * queue is mocked so the tests do not require a running Redis instance.
 *
 * The worker and PostgreSQL integration will be tested separately.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Mock the analytics queue before importing the service.
 *
 * This prevents the test from creating a real BullMQ Queue and attempting
 * to connect to Redis.
 */
vi.mock('./analytics.queue.js', () => ({
  analyticsQueue: {
    add: vi.fn(),
  },
}))

import { analyticsQueue } from './analytics.queue.js'

import { recordClickAsync } from './analytics.service.js'

const analyticsQueueMock = vi.mocked(analyticsQueue)
const addMock = analyticsQueueMock['add']

describe('Analytics service', () => {
  /**
   * Reset mock calls and implementations before every test.
   *
   * This keeps each test independent from the others.
   */
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('recordClickAsync', () => {
    /**
     * Verifies that a click event is added to the analytics queue
     * with the expected job name and payload.
     */
    it('adds a click event to the analytics queue', async () => {
      addMock.mockResolvedValue({} as never)

      const urlId = 123n

      await recordClickAsync(urlId)

      /**
       * Verify that BullMQ receives the expected job.
       */
      expect(addMock).toHaveBeenCalledOnce()

      /**
       * Extract the arguments passed to queue.add() so we can verify
       * the complete job configuration.
       */
      const [jobName, jobData, jobOptions] = addMock.mock.calls[0] ?? []

      expect(jobName).toBe('url-click')

      expect(jobData).toMatchObject({
        urlId: '123',
      })

      /**
       * clickedAt is generated at runtime, so instead of checking for
       * an exact timestamp, verify that it is a valid ISO timestamp.
       */
      expect(jobData).toHaveProperty('clickedAt')

      if (typeof jobData === 'object' && jobData !== null) {
        const clickedAt = (jobData as { clickedAt?: unknown }).clickedAt

        expect(typeof clickedAt).toBe('string')

        expect(Number.isNaN(Date.parse(clickedAt as string))).toBe(false)
      }

      /**
       * Verify the BullMQ cleanup options.
       *
       * Successful jobs should be removed automatically while failed
       * jobs should remain available for inspection/retry.
       */
      expect(jobOptions).toEqual({
        removeOnComplete: true,
        removeOnFail: false,
      })
    })

    /**
     * Verifies that BigInt URL IDs are converted to strings before
     * being placed into the queue payload.
     *
     * JSON/BullMQ payloads cannot safely serialize JavaScript BigInt
     * values directly.
     */
    it('serializes the URL ID as a string', async () => {
      addMock.mockResolvedValue({} as never)

      const urlId = 987654321987654321n

      await recordClickAsync(urlId)

      const [, jobData] = addMock.mock.calls[0] ?? []

      expect(jobData).toMatchObject({
        urlId: '987654321987654321',
      })
    })

    /**
     * Verifies that an error from BullMQ is propagated to the caller.
     *
     * The redirect controller handles this error separately so that a
     * queue failure does not prevent the redirect from being returned.
     */
    it('propagates queue errors', async () => {
      const queueError = new Error('Redis connection failed')

      addMock.mockRejectedValue(queueError)

      await expect(recordClickAsync(123n)).rejects.toThrow('Redis connection failed')
    })
  })
})
