/**
 * Get display label for a form field key using GHL custom field labels map.
 * Use when showing dynamic form fields (e.g. franchise request, contact) so IDs show as names.
 * @param {string} fieldKey - Raw key (e.g. field_key from DB or GHL)
 * @param {Record<string, string>} fieldLabels - Map of field_key -> display name (from ghl_custom_fields or API)
 * @returns {string} Display label (name if in map, else formatted key)
 */
export function getFieldDisplayLabel(fieldKey, fieldLabels = {}) {
    if (fieldLabels[fieldKey]) return fieldLabels[fieldKey];
    return String(fieldKey).replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}
