import { prisma } from "lib/prismaClient";
import { ensureModel } from "server/utils/modelGuard";

const storeModel = prisma?.stores;

const HIGHLEVEL_BASE_URL = process.env.GO_HIGHLEVEL_API_URL || "https://rest.gohighlevel.com/v1";

export async function getStoreById(id) {
    const mdl = ensureModel(storeModel, "stores");
    return await mdl.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            store_name: true,
            highlevel_api_key: true,
            highlevel_location_id: true,
            settings: true,
        }
    });
}

export async function getFormSubmissions({ apiKey, page = 1, limit = 20, startAt, endAt, formId, locationId }) {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        // Only include dates if they are present
        if (startAt) {
            params.append("startAt", startAt);
        }

        if (endAt) {
            params.append("endAt", endAt);
        }

        if (formId) {
            params.append("formId", formId);
        }

        const url = `${HIGHLEVEL_BASE_URL}/forms/submissions?${params.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HighLevel API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Fetch custom fields from DB for this location where field_key contains "contact"
        let fieldMap = {};

        if (locationId) {
            try {
                const fields = await prisma.ghl_custom_fields.findMany({
                    where: {
                        location_id: locationId,
                        field_key: { in: ["contact.service", "contact.write_message"] }
                    },
                    select: { field_key: true, ghl_field_id: true }
                });

                fieldMap = fields.reduce((acc, f) => {
                    acc[f.ghl_field_id] = f.field_key.replace(/\./g, "_");
                    return acc;
                }, {});
            } catch (e) {
                console.error("Error fetching contact custom fields:", e);
            }
        }

        const submissionData = Array.isArray(data?.submissions) ? data.submissions.map(item => {
            const newItem = {};

            Object.keys(item).forEach(key => {
                if (fieldMap[key]) {
                    newItem[fieldMap[key]] = item[key];
                } else {
                    newItem[key] = item[key];
                }
            });

            return newItem;
        }) : [];

        return {
            submissions: submissionData || [],
            meta: data?.meta || { total: 0, currentPage: page, nextPage: null, prevPage: null },
        };

    } catch (err) {
        console.error("Error fetching form submissions from HighLevel:", err);
        throw err;
    }
}

