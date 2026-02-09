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
            settings: true,
        }
    });
}

export async function getFormSubmissions({ apiKey, page = 1, limit = 20, startAt, endAt, calendarId }) {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        params.append("includeAll", true);
        params.delete("storeId");

        if (startAt) {
            params.append("startDate", startAt);
        }

        if (endAt) {
            params.append("endDate", endAt);
        }

        if (calendarId) {
            params.append("calendarId", calendarId);
        }

        const url = `${HIGHLEVEL_BASE_URL}/appointments?${params.toString()}`;

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

        return {
            appointments: data?.appointments || [],
            meta: { total: data?.appointments?.length || 0, currentPage: page, nextPage: null, prevPage: null }
        };

    } catch (err) {
        console.error("Error fetching form appointments from HighLevel:", err);
        throw err;
    }
}

export async function getFormSubmissionById({ apiKey, submissionId }) {
    try {
        const url = `${HIGHLEVEL_BASE_URL}/forms/submissions/${submissionId}`;

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

        return data?.submission || data;

    } catch (err) {
        console.error("Error fetching form submission from HighLevel:", err);
        throw err;
    }
}

