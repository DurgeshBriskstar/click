import { deleteRecord, getRecord, getRecords, storeRecord, updateRecord, isSlugUnique, cloneRecord, makePrimaryRecord, checkPrimaryRecord } from "server/services/store.service";
import { error, success } from "server/utils/response";
import { storeSchema } from "server/validations/store.schema";
import { saveBase64File } from "server/utils/saveBase64File";
import { processCMSSections } from "server/utils/helper";
import { getAuthenticatedUser, isSuperAdmin, isStoreAdmin, canAccessStore } from "server/utils/auth";

export const StoreController = {

    async getStores(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }
            const { searchParams } = new URL(req.url);

            const search = searchParams.get("search") || "";
            const page = Number(searchParams.get("page")) || 1;
            const rowsPerPage = Number(searchParams.get("rowsPerPage")) || 10;
            const orderBy = searchParams.get("orderBy") || "id";
            const order = searchParams.get("order") || "desc";

            let result = await getRecords({
                search,
                page,
                rowsPerPage,
                orderBy,
                order
            });

            // Store admin can only see their own store
            if (!isSuperAdmin(user) && user.store_id) {
                const userStoreId = typeof user.store_id === 'string' ? parseInt(user.store_id, 10) : user.store_id;
                result.data = result.data.filter(store => Number(store.id) === Number(userStoreId));
                result.count = result.data.length;
            }

            return success({
                message: "Stores retrieved successfully!",
                data: result.data,
                count: result.count
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getStore(req, recordId) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }
            const id = Number(recordId);

            // Verify store access
            if (!canAccessStore(user, id)) {
                return error("Access denied to this store", 403);
            }

            const data = await getRecord(id);

            return success({
                message: data ? "Store retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async saveStore(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const body = await req.json();
            await storeSchema.validate(body);

            // Check slug uniqueness
            if (body.store_slug) {
                const slugUnique = await isSlugUnique(body.store_slug);
                if (!slugUnique) {
                    return error("This slug is already in use. Please choose a different slug.", 400);
                }
            }

            let processedBody = { ...body };

            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "stores",
                    "img"
                );
                processedBody.image = `/backend-assets/stores/${fileName}`;
            } else if (!body.image) {
                processedBody.image = null;
            }

            // Process sections images similar to CMS pages
            if (body.sections && Object.keys(body.sections).length > 0) {
                processedBody.sections = await processCMSSections(body.sections, "stores");
            }

            const record = await storeRecord(processedBody);

            return success({
                message: "Store created successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async updateStore(req, recordId) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user) {
                return error("Unauthorized", 401);
            }
            const id = Number(recordId);

            // Verify store access
            if (!canAccessStore(user, id)) {
                return error("Access denied to this store", 403);
            }

            const body = await req.json();
            await storeSchema.validate(body);

            // Check slug uniqueness (excluding current record)
            if (body.store_slug) {
                const slugUnique = await isSlugUnique(body.store_slug, id);
                if (!slugUnique) {
                    return error("This slug is already in use. Please choose a different slug.", 400);
                }
            }

            let processedBody = { ...body };

            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "stores",
                    "img"
                );
                processedBody.image = `/backend-assets/stores/${fileName}`;
            } else if (body.image === null || body.image === "") {
                processedBody.image = null;
            }

            // Process sections images similar to CMS pages
            if (body.sections && Object.keys(body.sections).length > 0) {
                processedBody.sections = await processCMSSections(body.sections, "stores");
            }

            // Store admin cannot change store name or slug - super admin only
            if (isStoreAdmin(user)) {
                delete processedBody.store_name;
                delete processedBody.store_slug;
            }

            const record = await updateRecord(id, processedBody);

            return success({ message: "Store updated successfully!", data: record });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async deleteStore(req, recordId) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const id = Number(recordId);
            const data = await deleteRecord(id);

            return success({ message: "Record deleted successfully!", data });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async cloneStore(req, recordId) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const id = Number(recordId);
            const record = await cloneRecord(id);

            return success({
                message: "Store cloned successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async makePrimaryStore(req, recordId) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const id = Number(recordId);
            const record = await makePrimaryRecord(id);

            return success({
                message: "Store marked as primary successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async checkPrimaryStore(req) {
        try {
            const data = await checkPrimaryRecord();

            return success({
                message: "Primary store check completed!",
                data
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    }
};

