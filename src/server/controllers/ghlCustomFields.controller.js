import { error, success } from "server/utils/response";
import { getAuthenticatedUser } from "server/utils/auth";
import { syncGhlCustomFieldsForAllStores } from "server/services/ghlCustomFields.service";

export const GhlCustomFieldsController = {

    async syncCustomFields(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }

            const result = await syncGhlCustomFieldsForAllStores();

            return success({
                data: {
                    synced: result.synced,
                    totalFields: result.totalFields,
                    errors: result.errors
                },
                message: result.message
            });
        } catch (err) {
            console.error("GHL sync custom fields error:", err);
            return error(err.message || "Failed to sync GHL custom fields", 500);
        }
    }
};
