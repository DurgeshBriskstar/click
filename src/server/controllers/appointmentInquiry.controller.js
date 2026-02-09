import { getStoreById, getFormSubmissions, getFormSubmissionById } from "server/services/appointmentInquiry.service";
import { error, success } from "server/utils/response";
import { getAuthenticatedUser, canAccessStore } from "server/utils/auth";

export const AppointmentInquiryController = {

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
            const startDate = searchParams.get("startDate") || null;
            const endDate = searchParams.get("endDate") || null;

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

            if (!store.highlevel_api_key) {
                return error("This store does not have a HighLevel API key configured", 400);
            }

            if (!store?.settings?.appointment_calendar_form_id) {
                return error("This store does not have a HighLevel Form Id configured", 400);
            }

            // Fetch form submissions from GoHighLevel API
            const result = await getFormSubmissions({
                apiKey: store?.highlevel_api_key,
                page,
                limit,
                startAt: startDate,
                endAt: endDate,
                calendarId: store?.settings?.appointment_calendar_form_id
            });

            return success({
                message: "Inquiries retrieved successfully!",
                data: result
            });

        } catch (err) {
            console.error("Error fetching inquiries:", err);
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getFormSubmission(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            const { searchParams } = new URL(req.url);

            const storeId = searchParams.get("storeId");
            const submissionId = searchParams.get("submissionId");

            if (!storeId) {
                return error("Store ID is required", 400);
            }

            if (!submissionId) {
                return error("Form Submission ID is required", 400);
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

            // Fetch form submission from GoHighLevel API
            const submission = await getFormSubmissionById({
                apiKey: store?.highlevel_api_key,
                submissionId,
            });

            return success({
                message: "Form submission retrieved successfully!",
                data: submission
            });

        } catch (err) {
            console.error("Error fetching form submission:", err);
            return error(err?.message || "Internal server error", 500);
        }
    }
};

