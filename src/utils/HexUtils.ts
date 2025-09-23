/**
 * Utility class for hex conversions.
 */
export class HexUtils {
  /**
   * Convert a Uint8Array to a hex string.
   */
  public static uint8ArrayToHex(uint8Array: Uint8Array): string {
    return Array.from(uint8Array)
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }
}
