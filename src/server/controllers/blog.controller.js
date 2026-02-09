import { deleteRecord, getRecord, getRecords, storeRecord, updateRecord } from "server/services/blog.service";
import { error, success } from "server/utils/response";
import { blogSchema } from "server/validations/blog.schema";
import { saveBase64File } from "server/utils/saveBase64File";
import { processRichTextContent } from "server/utils/processRichTextContent";

export const BlogController = {

    async getBlogs(req) {
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
                message: "Blogs retrieved successfully!",
                data: result.data,
                count: result.count
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async getBlog(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await getRecord(id);

            return success({
                message: data ? "Blog retrieved successfully!" : "No record found",
                data
            });
        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async saveBlog(req) {
        try {
            const body = await req.json();
            await blogSchema.validate(body);

            let processedBody = {
                ...body,
                slug: body.slug?.toLowerCase()?.trim(),
            };

            // Process featured image
            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "blogs",
                    "img"
                );
                processedBody.image = `/backend-assets/blogs/${fileName}`;
            } else if (!body.image) {
                processedBody.image = null;
            }

            // Process content field - extract and upload base64 images
            if (body.content) {
                processedBody.content = await processRichTextContent(
                    body.content,
                    "blogs",
                    "content"
                );
            }

            const record = await storeRecord(processedBody);

            return success({
                message: "Blog created successfully!",
                data: record
            });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async updateBlog(req, recordId) {
        try {
            const id = Number(recordId);
            const body = await req.json();
            await blogSchema.validate(body);

            let processedBody = {
                ...body,
                slug: body.slug?.toLowerCase()?.trim(),
            };

            // Process featured image
            if (body.image?.base64) {
                const fileName = await saveBase64File(
                    body.image.base64,
                    "blogs",
                    "img"
                );
                processedBody.image = `/backend-assets/blogs/${fileName}`;
            } else if (body.image === null || body.image === "") {
                processedBody.image = null;
            }

            // Process content field - extract and upload base64 images
            if (body.content) {
                processedBody.content = await processRichTextContent(
                    body.content,
                    "blogs",
                    "content"
                );
            }

            const record = await updateRecord(id, processedBody);

            return success({ message: "Blog updated successfully!", data: record });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    },

    async deleteBlog(req, recordId) {
        try {
            const id = Number(recordId);
            const data = await deleteRecord(id);

            return success({ message: "Record deleted successfully!", data });

        } catch (err) {
            return error(err?.message || "Internal server error", 500);
        }
    }
};


