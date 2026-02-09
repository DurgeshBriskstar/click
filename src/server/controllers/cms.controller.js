import { getRecordByPageKey } from "server/services/cms.service";
import { deleteRecord, getRecord, getRecords, storeRecord, updateRecord } from "server/services/cms.service";
import { processCMSSections } from "server/utils/helper";
import { error, success } from "server/utils/response";
import { settingSchema } from "server/validations/setting.schema";

export const CmsController = {

    async getPages(req) {
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
                message: "Pages retrieved successfully!",
                data: result.data,
                count: result.count
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getPage(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await getRecord(id);

            return success({
                message: data ? "Page retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async savePage(req) {
        try {
            const body = await req.json();
            await settingSchema.cmsPageSchema.validate(body);

            body.sections = await processCMSSections(body?.sections, `cms-pages/${body?.page_key}`);

            const record = await storeRecord(body);

            return success({
                message: "Page created successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async updatePage(req, recordId) {
        try {
            const id = Number(recordId);
            const body = await req.json();
            await settingSchema.cmsPageSchema.validate(body);

            body.sections = await processCMSSections(body?.sections, `cms-pages/${body?.page_key}`);

            const record = await updateRecord(id, body);

            return success({ message: "Page updated successfully!", data: record });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async deletePage(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await deleteRecord(id);

            return success({ message: "Record deleted successfully!", data });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },



    // Public

    async getPageByKey(req, pageKey) {
        try {
            const data = await getRecordByPageKey(pageKey);

            return success({
                message: data ? "Page retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },
};
