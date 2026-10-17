/**
 * Formats a table name for customer display.
 * Avoids showing raw MongoDB ObjectIds (24-char hex) and ensures friendly labels like "Table 1", "Rooftop 2", etc.
 */
export function formatTableName(rawName, fallback = "Table") {
  if (!rawName) return fallback;
  const trimmed = String(rawName).trim();

  // If rawName is a 24-char hex MongoDB ObjectId, don't show it to customer
  if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
    return fallback;
  }

  // If already starts with "Table" (e.g. "Table 1", "Table 05", "Table-2")
  if (/^table[\s-]/i.test(trimmed)) {
    return trimmed;
  }

  // If it's a numeric string (e.g. "1", "05", "12")
  if (/^\d+$/.test(trimmed)) {
    return `Table ${trimmed}`;
  }

  // If it's a custom name (e.g. "Rooftop 2", "VIP Lounge", "Corner Booth")
  return trimmed;
}
