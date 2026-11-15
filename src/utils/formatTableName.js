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

/**
 * Formats a table name into a compact badge label like "T-1", "T-2", etc.
 */
export function formatShortTableLabel(rawName, fallbackLabel = "") {
  const candidate = String(fallbackLabel || rawName || "").trim();
  if (!candidate || /^[0-9a-fA-F]{24}$/.test(candidate)) return "";

  // If already starts with T- or T (e.g. "T-01", "T-1", "T01", "T 1")
  const tMatch = candidate.match(/^T[\s-]?(\d+)/i);
  if (tMatch && tMatch[1]) {
    return `T-${parseInt(tMatch[1], 10)}`;
  }

  // If starts with "Table" (e.g. "Table 01", "Table 1", "Table-2")
  const tableMatch = candidate.match(/^table[\s-]?(\d+)/i);
  if (tableMatch && tableMatch[1]) {
    return `T-${parseInt(tableMatch[1], 10)}`;
  }

  // If purely numeric (e.g. "01", "2")
  if (/^\d+$/.test(candidate)) {
    return `T-${parseInt(candidate, 10)}`;
  }

  // If custom area or name like "Rooftop 2" or "Bar 1"
  const areaMatch = candidate.match(/^([a-zA-Z]+)[\s-](\d+)$/);
  if (areaMatch) {
    const prefix = areaMatch[1].slice(0, 2).toUpperCase();
    return `${prefix}-${parseInt(areaMatch[2], 10)}`;
  }

  // Fallback: if short, return as is (e.g. "VIP")
  if (candidate.length <= 6) return candidate.toUpperCase();

  return candidate.slice(0, 6);
}
