import { deleteRecord, getRecord, getRecords, storeRecord, updateRecord, isSlugUnique } from "server/services/service.service";
import { processCMSSections } from "server/utils/helper";
import { error, success } from "server/utils/response";
import { serviceSchema } from "server/validations/service.schema";
import { saveBase64File } from "server/utils/saveBase64File";

export const ServiceController = {

    async getServices(req) {
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
                message: "Services retrieved successfully!",
                data: result.data,
                count: result.count
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getService(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await getRecord(id);

            return success({
                message: data ? "Service retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async saveService(req) {
        try {
            const body = await req.json();
            await serviceSchema.validate(body);

            // Check slug uniqueness
            if (body.service_slug) {
                const slugUnique = await isSlugUnique(body.service_slug);
                if (!slugUnique) {
                    return error("This slug is already in use. Please choose a different slug.", 400);
                }
            }

            let processedBody = { ...body };

            if (body?.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "services",
                    "img"
                );
                processedBody.image = `/backend-assets/services/${fileName}`;
            } else {
                processedBody.image = body?.image ?? null;
            }

            if (body?.icon?.base64) {
                const fileName = await saveBase64File(
                    body.icon.base64,
                    "services",
                    "icon"
                );
                processedBody.icon = `/backend-assets/services/${fileName}`;
            } else {
                processedBody.icon = body?.icon ?? null;
            }

            if (body.sections && Object.keys(body.sections).length > 0) {
                const processedSections = {};
                for (const layoutCode of Object.keys(body.sections)) {
                    processedSections[layoutCode] = await processCMSSections(body.sections[layoutCode], "services");
                }
                processedBody.sections = processedSections;
            }

            const record = await storeRecord(processedBody);

            return success({
                message: "Service created successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async updateService(req, recordId) {
        try {
            const id = Number(recordId);
            const body = await req.json();
            await serviceSchema.validate(body);

            // Check slug uniqueness (excluding current record)
            if (body.service_slug) {
                const slugUnique = await isSlugUnique(body.service_slug, id);
                if (!slugUnique) {
                    return error("This slug is already in use. Please choose a different slug.", 400);
                }
            }

            let processedBody = { ...body };
            if (body?.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "services",
                    "img"
                );
                processedBody.image = `/backend-assets/services/${fileName}`;
            } else {
                processedBody.image = body?.image ?? null;
            }

            if (body?.icon?.base64) {
                const fileName = await saveBase64File(
                    body.icon.base64,
                    "services",
                    "icon"
                );
                processedBody.icon = `/backend-assets/services/${fileName}`;
            } else {
                processedBody.icon = body?.icon ?? null;
            }

            if (body.sections && Object.keys(body.sections).length > 0) {
                const processedSections = {};
                for (const layoutCode of Object.keys(body.sections)) {
                    processedSections[layoutCode] = await processCMSSections(body.sections[layoutCode], "services");
                }
                processedBody.sections = processedSections;
            }

            const record = await updateRecord(id, processedBody);

            return success({ message: "Service updated successfully!", data: record });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async deleteService(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await deleteRecord(id);

            return success({ message: "Record deleted successfully!", data });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    }
};
