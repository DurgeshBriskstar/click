import { deleteRecord, getRecord, getRecords, storeRecord, updateRecord } from "server/services/partner.service";
import { error, success } from "server/utils/response";
import { partnerSchema } from "server/validations/partner.schema";
import { saveBase64File } from "server/utils/saveBase64File";

export const PartnerController = {

    async getPartners(req) {
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
                message: "Partners retrieved successfully!",
                data: result.data,
                count: result.count
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getPartner(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await getRecord(id);

            return success({
                message: data ? "Partner retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async savePartner(req) {
        try {
            const body = await req.json();
            await partnerSchema.validate(body);

            let processedBody = { ...body };

            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "partners",
                    "img"
                );
                processedBody.image = `/backend-assets/partners/${fileName}`;
            } else if (!body.image) {
                processedBody.image = null;
            }

            const record = await storeRecord(processedBody);

            return success({
                message: "Partner created successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async updatePartner(req, recordId) {
        try {
            const id = Number(recordId);
            const body = await req.json();
            await partnerSchema.validate(body);

            let processedBody = { ...body };

            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "partners",
                    "img"
                );
                processedBody.image = `/backend-assets/partners/${fileName}`;
            } else if (body.image === null || body.image === "") {
                processedBody.image = null;
            }

            const record = await updateRecord(id, processedBody);

            return success({ message: "Partner updated successfully!", data: record });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async deletePartner(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await deleteRecord(id);

            return success({ message: "Record deleted successfully!", data });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    }
};

