export function map0_1To0_255(val: number): number {
  return Math.round(val * 255);
}

/**
 * Converts a number between 0 and 255 to its hexadecimal string representation.
 * @param val - The numeric value to convert (should be between 0 and 255)
 * @returns A two-character hexadecimal string representation of the number
 * @example
 * ```typescript
 * from0_255ToHexString(255) // returns "ff"
 * from0_255ToHexString(0)   // returns "00"
 * from0_255ToHexString(16)  // returns "10"
 * ```
 */
export function from0_255ToHexString(val: number): string {
  const hex = val.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}
