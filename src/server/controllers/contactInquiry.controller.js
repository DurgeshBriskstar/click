import { getStoreById, getFormSubmissions } from "server/services/contactInquiry.service";
import { error, success } from "server/utils/response";
import { getAuthenticatedUser, canAccessStore } from "server/utils/auth";

export const ContactInquiryController = {

    async getInquiries(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            const { searchParams } = new URL(req.url);

            const storeId = searchParams.get("storeId");
            const page = Number(searchParams.get("page")) || 1;
            const limit = Number(searchParams.get("limit")) || 20;
            const startAt = searchParams.get("startAt");
            const endAt = searchParams.get("endAt");

            if (!storeId) {
                return error("Store ID is required", 400);
            }

            const storeIdNum = Number(storeId);

            // Verify user can access this store
            if (!canAccessStore(user, storeIdNum)) {
                return error("Access denied to this store", 403);
            }

            // Get store details to retrieve the highlevel_api_key
            const store = await getStoreById(storeIdNum);

            if (!store) {
                return error("Store not found", 404);
            }


            if (!store.highlevel_api_key || !store.highlevel_location_id) {
                return error("This store does not have a HighLevel API key configured", 400);
            }

            if (!store?.settings?.contact_form_id) {
                return error("This store does not have a HighLevel Form Id configured", 400);
            }

            // Fetch form submissions from GoHighLevel API
            const result = await getFormSubmissions({
                apiKey: store.highlevel_api_key,
                page,
                limit,
                startAt,
                endAt,
                formId: store?.settings?.contact_form_id,
                locationId: store.highlevel_location_id
            });

            return success({
                message: "Inquiries retrieved successfully!",
                data: result
            });

        } catch (err) {
            console.error("Error fetching inquiries:", err);
            return error(err?.message || "Internal server error", 500);
        }
    }
};

