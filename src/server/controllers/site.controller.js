import { deleteRecord, getRecord, getRecordBySiteKey, getRecords, storeRecord, updateRecord } from "server/services/site.service";
import { processSiteSettings } from "server/utils/helper";
import { error, success } from "server/utils/response";
import { saveBase64File } from "server/utils/saveBase64File";
import { settingSchema } from "server/validations/setting.schema";

export const SiteController = {

    async getSites(req) {
        try {
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
                message: "Sites retrieved successfully!",
                data: result.data,
                count: result.count
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getSite(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await getRecord(id);

            return success({
                message: data ? "Site retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async saveSite(req) {
        try {
            const body = await req.json();
            if (body?.source && body?.source === "general") {
                await settingSchema.cmsSiteSchema.validate(body);
            }

            const processedBody = await processSiteSettings(body);

            const record = await storeRecord(processedBody);

            return success({
                message: "Site created successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async updateSite(req, recordId) {
        try {
            const id = Number(recordId);
            const body = await req.json();
            if (body?.source && body?.source === "general") {
                await settingSchema.cmsSiteSchema.validate(body);
            }

            const processedBody = await processSiteSettings(body);

            const record = await updateRecord(id, processedBody);

            return success({ message: "Site updated successfully!", data: record });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async deleteSite(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await deleteRecord(id);

            return success({ message: "Record deleted successfully!", data });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },



    // Public

    async getSiteByKey(siteKey) {
        try {
            const data = await getRecordBySiteKey(siteKey);

            return success({
                message: data ? "Site retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },
};
