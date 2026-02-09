import { getUserById, getFormSubmissions } from "server/services/franchiseInquiry.service";
import { error, success } from "server/utils/response";
import { getAuthenticatedUser, isSuperAdmin } from "server/utils/auth";

export const FranchiseInquiryController = {

    async getInquiries(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            // Only super admin can access franchise requests
            if (!isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }

            const { searchParams } = new URL(req.url);

            const page = Number(searchParams.get("page")) || 1;
            const limit = Number(searchParams.get("limit")) || 20;
            const startAt = searchParams.get("startAt") || null;
            const endAt = searchParams.get("endAt") || null;

            // Get user details to retrieve the highlevel_franchise_access_token and form_id
            const userDetails = await getUserById(user.id);

            if (!userDetails) {
                return error("User not found", 404);
            }

            if (!userDetails.highlevel_franchise_access_token) {
                return error("HighLevel Franchise Access Token is not configured", 400);
            }

            if (!userDetails.highlevel_franchise_form_id) {
                return error("HighLevel Franchise Form Id is not configured", 400);
            }

            // Fetch form submissions from GoHighLevel API
            const result = await getFormSubmissions({
                apiKey: userDetails.highlevel_franchise_access_token,
                page,
                limit,
                startAt,
                endAt,
                formId: userDetails.highlevel_franchise_form_id
            });

            return success({
                message: "Franchise requests retrieved successfully!",
                data: result
            });

        } catch (err) {
            console.error("Error fetching franchise requests:", err);
            return error(err?.message || "Internal server error", 500);
        }
    }
};

