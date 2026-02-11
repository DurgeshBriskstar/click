import { prisma } from "lib/prismaClient";

const HIGHLEVEL_BASE_URL = process.env.GO_HIGHLEVEL_API_URL || "https://rest.gohighlevel.com/v1";

/**
 * Get all stores that have both highlevel_location_id and highlevel_api_key
 */
export async function getStoresWithGhlConfig() {
    const stores = await prisma.stores.findMany({
        where: {
            deleted_at: null,
            highlevel_location_id: { not: null },
            highlevel_api_key: { not: null }
        },
        select: {
            id: true,
            store_name: true,
            highlevel_location_id: true,
            highlevel_api_key: true
        }
    });
    return stores.filter(s => s.highlevel_location_id?.trim() && s.highlevel_api_key?.trim());
}

/**
 * Fetch custom fields from GHL API
 * GET https://rest.gohighlevel.com/v1/custom-fields (Bearer token = highlevel_api_key)
 */
export async function fetchGhlCustomFields(apiKey) {
    const url = `${HIGHLEVEL_BASE_URL}/custom-fields`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GHL API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const list = data?.customFields ?? data?.custom_fields ?? (Array.isArray(data) ? data : []);
    return list;
}

/**
 * Normalize a custom field from GHL response (may use id, name, key or fieldKey)
 */
function normalizeField(field) {
    const id = field?.id ?? field?.Id ?? null;
    const name = field?.name ?? field?.label ?? field?.Name ?? null;
    const fieldKey = field?.fieldKey ?? field?.key ?? field?.field_key ?? field?.FieldKey ?? null;
    return { id, name, fieldKey };
}

/**
 * Build id->fieldKey and fieldKey->name maps from GHL API response (common for any form using GHL).
 * Use when you have apiKey but no locationId in DB (e.g. franchise form).
 */
export function buildCustomFieldMapsFromApiFields(fields) {
    const list = Array.isArray(fields) ? fields : [];
    const idToFieldKey = {};
    const fieldKeyToName = {};
    list.forEach((f) => {
        const { id: ghlId, name, fieldKey } = normalizeField(f);
        if (ghlId != null && fieldKey) {
            idToFieldKey[String(ghlId)] = fieldKey;
            fieldKeyToName[fieldKey] = name != null ? String(name) : fieldKey;
        }
    });
    return { idToFieldKey, fieldKeyToName };
}

/**
 * Map a single submission object: replace keys that are GHL field IDs with field_key.
 * Keys not in the map are left as-is.
 */
export function mapSubmissionKeysToFieldKeys(submission, idToFieldKey) {
    if (!submission || typeof submission !== "object") return submission;
    const out = {};
    Object.keys(submission).forEach((key) => {
        const fieldKey = idToFieldKey[key];
        out[fieldKey != null ? fieldKey : key] = submission[key];
    });
    return out;
}

/**
 * Upsert custom fields into ghl_custom_fields using Prisma (no duplicate on location_id + field_key).
 */
export async function upsertGhlCustomFields(locationId, fields) {
    if (!fields?.length) return 0;

    let upserted = 0;
    for (const field of fields) {
        const { id: ghlFieldId, name, fieldKey } = normalizeField(field);
        if (!fieldKey) continue;

        const safeName = (name != null ? String(name) : null)?.substring(0, 500) ?? null;
        const safeKey = (fieldKey != null ? String(fieldKey) : null)?.substring(0, 255) ?? null;
        const safeGhlId = (ghlFieldId != null ? String(ghlFieldId) : null)?.substring(0, 100) ?? null;
        const safeLocId = (locationId != null ? String(locationId) : null)?.substring(0, 255) ?? null;

        if (!safeLocId || !safeKey) continue;

        await prisma.ghl_custom_fields.upsert({
            where: {
                location_id_field_key: {
                    location_id: safeLocId,
                    field_key: safeKey
                }
            },
            create: {
                location_id: safeLocId,
                ghl_field_id: safeGhlId,
                name: safeName,
                field_key: safeKey
            },
            update: {
                ghl_field_id: safeGhlId,
                name: safeName
            }
        });
        upserted += 1;
    }
    return upserted;
}

/**
 * Get fieldKey -> display name map from DB for a location (common for contact/store forms).
 */
export async function getCustomFieldLabelsByLocationId(locationId) {
    if (!locationId) return {};
    const rows = await prisma.ghl_custom_fields.findMany({
        where: { location_id: String(locationId) },
        select: { field_key: true, name: true }
    });
    return rows.reduce((acc, r) => {
        if (r.field_key) acc[r.field_key] = r.name || r.field_key;
        return acc;
    }, {});
}

/**
 * Sync GHL custom fields for all configured stores
 */
export async function syncGhlCustomFieldsForAllStores() {
    const stores = await getStoresWithGhlConfig();
    if (stores.length === 0) {
        return { synced: 0, totalFields: 0, message: "No stores with HighLevel location ID and API key configured." };
    }

    let totalFields = 0;
    const errors = [];

    for (const store of stores) {
        try {
            const fields = await fetchGhlCustomFields(store.highlevel_api_key);
            const count = await upsertGhlCustomFields(store.highlevel_location_id, fields);
            totalFields += count;
        } catch (err) {
            console.error(`GHL sync error for store ${store.store_name} (${store.highlevel_location_id}):`, err);
            errors.push({ store: store.store_name, error: err.message });
        }
    }

    const message = errors.length === 0
        ? `Synced ${totalFields} custom field(s) from ${stores.length} store(s).`
        : `Synced ${totalFields} custom field(s). Some stores failed: ${errors.map(e => e.store).join(", ")}.`;

    return {
        synced: stores.length,
        totalFields,
        errors: errors.length > 0 ? errors : undefined,
        message
    };
}
