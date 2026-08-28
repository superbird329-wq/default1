/**
 * Split a string after every occurrence of a separator, keeping the separator
 * on the end of each piece.
 *
 * Used to place <wbr> hints in long unbroken values — an email address should
 * wrap after the "@", not in the middle of the local part, which is what
 * `overflow-wrap: anywhere` does on its own.
 */
export function splitAfter(value: string, separator: string): string[] {
  const parts = value.split(separator);
  return parts.map((part, index) => (index < parts.length - 1 ? part + separator : part));
}
