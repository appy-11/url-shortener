/**
 * Vitest configuration for the backend test suite.
 *
 * Tests are kept under src and compiled files under dist are excluded
 * so that the same test is never executed twice.
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules/**', 'dist/**'],
  },
})
