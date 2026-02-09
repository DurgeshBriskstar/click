import { deleteRecord, getRecord, getRecords, storeRecord, updateRecord, isEmailUnique } from "server/services/user.service";
import { error, success } from "server/utils/response";
import { userCreateSchema, userUpdateSchema } from "server/validations/user.schema";
import { saveBase64File } from "server/utils/saveBase64File";
import { getAuthenticatedUser, isSuperAdmin } from "server/utils/auth";

export const UserController = {

    async getUsers(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const { searchParams } = new URL(req.url);

            const search = searchParams.get("search") || "";
            const page = Number(searchParams.get("page")) || 1;
            const rowsPerPage = Number(searchParams.get("rowsPerPage")) || 10;
            const orderBy = searchParams.get("orderBy") || "id";
            const order = searchParams.get("order") || "desc";

            const result = await getRecords({
                search,
                page,
                rowsPerPage,
                orderBy,
                order
            });

            return success({
                message: "Users retrieved successfully!",
                data: result.data,
                count: result.count
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getUser(req, recordId) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const id = Number(recordId);
            const data = await getRecord(id);

            return success({
                message: data ? "User retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async saveUser(req) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const body = await req.json();
            await userCreateSchema.validate(body);

            // Check email uniqueness
            const emailUnique = await isEmailUnique(body.email);
            if (!emailUnique) {
                return error("This email is already in use. Please use a different email.", 400);
            }

            let processedBody = { ...body };

            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "users",
                    "img"
                );
                processedBody.image = `/backend-assets/users/${fileName}`;
            } else if (!body.image) {
                processedBody.image = null;
            }

            const record = await storeRecord(processedBody);

            return success({
                message: "User created successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async updateUser(req, recordId) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const id = Number(recordId);
            const body = await req.json();
            await userUpdateSchema.validate(body);

            let processedBody = { ...body };

            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "users",
                    "img"
                );
                processedBody.image = `/backend-assets/users/${fileName}`;
            } else if (body.image === null || body.image === "") {
                processedBody.image = null;
            }

            const record = await updateRecord(id, processedBody);

            return success({ message: "User updated successfully!", data: record });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async deleteUser(req, recordId) {
        try {
            const user = await getAuthenticatedUser(req);
            if (!user || !isSuperAdmin(user)) {
                return error("Access denied. Super admin only.", 403);
            }
            const id = Number(recordId);
            const data = await deleteRecord(id);

            return success({ message: "User deleted successfully!", data });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    }
};

