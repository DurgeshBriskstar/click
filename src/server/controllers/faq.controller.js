import { deleteRecord, getRecord, getRecords, storeRecord, updateRecord } from "server/services/faq.service";
import { error, success } from "server/utils/response";
import { faqSchema } from "server/validations/faq.schema";

export const FaqController = {

    async getFaqs(req) {
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
                message: "FAQs retrieved successfully!",
                data: result.data,
                count: result.count
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getFaq(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await getRecord(id);

            return success({
                message: data ? "FAQ retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async saveFaq(req) {
        try {
            const body = await req.json();
            await faqSchema.validate(body);

            const record = await storeRecord(body);

            return success({
                message: "FAQ created successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async updateFaq(req, recordId) {
        try {
            const id = Number(recordId);
            const body = await req.json();
            await faqSchema.validate(body);

            const record = await updateRecord(id, body);

            return success({ message: "FAQ updated successfully!", data: record });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async deleteFaq(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await deleteRecord(id);

            return success({ message: "Record deleted successfully!", data });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    }
};

