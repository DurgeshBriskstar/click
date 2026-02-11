import { prisma } from "lib/prismaClient";
import { ensureModel } from "server/utils/modelGuard";
import { fetchGhlCustomFields, buildCustomFieldMapsFromApiFields, mapSubmissionKeysToFieldKeys } from "server/services/ghlCustomFields.service";

const userModel = prisma?.users;

const HIGHLEVEL_BASE_URL = process.env.GO_HIGHLEVEL_API_URL || "https://rest.gohighlevel.com/v1";

export async function getUserById(id) {
    const mdl = ensureModel(userModel, "users");
    return await mdl.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            highlevel_franchise_access_token: true,
            highlevel_franchise_form_id: true,
        }
    });
}

export async function getFormSubmissions({ apiKey, page = 1, limit = 20, startAt, endAt, formId }) {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

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
            const status = response.status;
            // Log raw error for debugging
            console.error("HighLevel API error:", status, errorText);

            let userMessage;
            if (status === 400) {
                userMessage = "Please check the HighLevel Franchise Form ID in your profile settings and ensure it matches a valid form in your HighLevel account.";
            } else if (status === 401) {
                userMessage = "HighLevel access token is invalid or expired. Please update the Franchise Access Token in your profile settings.";
            } else if (status === 404) {
                userMessage = "The form was not found. Please verify the HighLevel Franchise Form ID in your profile settings.";
            } else {
                userMessage = "Unable to load franchise requests from HighLevel. Please check your profile settings and try again.";
            }
            throw new Error(userMessage);
        }

        const data = await response.json();
        const rawSubmissions = data?.submissions || [];

        let fieldLabels = {};
        let submissions = rawSubmissions;

        try {
            const fields = await fetchGhlCustomFields(apiKey);
            const { idToFieldKey, fieldKeyToName } = buildCustomFieldMapsFromApiFields(fields);
            fieldLabels = fieldKeyToName;
            submissions = rawSubmissions.map((item) => mapSubmissionKeysToFieldKeys(item, idToFieldKey));
        } catch (e) {
            console.error("Error resolving franchise custom field labels:", e);
        }

        return {
            submissions,
            fieldLabels,
            meta: data?.meta || { total: 0, currentPage: page, nextPage: null, prevPage: null }
        };

    } catch (err) {
        console.error("Error fetching form submissions from HighLevel:", err);
        throw err;
    }
}

