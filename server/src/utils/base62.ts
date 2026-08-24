/**
 * This module provides utility functions for encoding and decoding values using Base62 encoding.
 * Base62 encoding is a method of representing numbers using a set of 62 characters (0-9, a-z, A-Z).
 * It is commonly used for generating short, human-readable strings from numeric values.
 */
const BASE62_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Encodes a bigint value into a Base62 string.
 * @param value The bigint value to encode.
 * @returns The Base62 encoded string.
 */
export const encodeBase62 = (value: bigint): string => {
  // Ensure that the input value is a non-negative integer.
  if (value < 0n) {
    throw new Error('Base62 value must be a non-negative integer')
  }

  // Handle the special case where the value is zero.
  if (value === 0n) {
    return BASE62_CHARACTERS[0]!
  }

  let encoded = ''
  let remaining = value

  // Convert the bigint value to Base62 by repeatedly dividing by 62 and collecting the remainders.
  while (remaining > 0n) {
    const remainder = Number(remaining % 62n)

    encoded = BASE62_CHARACTERS[remainder] + encoded

    remaining /= 62n
  }

  return encoded
}
