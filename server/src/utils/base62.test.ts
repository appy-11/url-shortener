/**
 * Tests for the base62 encoding function.
 */
import { describe, expect, it } from 'vitest'

import { encodeBase62 } from './base62.js'

// Test cases for the base62 encoding function

describe('encodeBase62', () => {
  // Test cases for zero
  it('encodes zero correctly', () => {
    expect(encodeBase62(0n)).toBe('0')
  })

  // Test cases for positive integers
  it('encodes positive integers', () => {
    expect(encodeBase62(1n)).toBe('1')
    expect(encodeBase62(10n)).toBe('a')
    expect(encodeBase62(61n)).toBe('Z')
    expect(encodeBase62(62n)).toBe('10')
  })

  // Test cases for larger integers
  it('encodes larger integers', () => {
    expect(encodeBase62(123456n)).toBe('w7e')
  })

  // Test cases for invalid inputs
  it('rejects negative values', () => {
    expect(() => encodeBase62(-1n)).toThrow('Base62 value must be a non-negative integer')
  })
})
