import { prisma } from "lib/prismaClient";
import { STATUS_DELETED } from "utils/constants";

const SOFT_DELETE = process.env.SOFT_DELETE_SYSTEM === "true";

// Lazy-load model to prevent client-side bundling
function getModel() {
    if (typeof window !== "undefined") {
        throw new Error("This function can only be called on the server");
    }
    return prisma["site_settings"];
}

export async function getRecords({ search, page, order, orderBy, rowsPerPage }) {
    const model = getModel();
    const skip = (page - 1) * rowsPerPage;
    const take = rowsPerPage;

    const where = search
        ? {
            title: {
                contains: search.toLowerCase()
            }
        }
        : {};

    const [data, count] = await Promise.all([
        model.findMany({
            where,
            skip,
            take,
            orderBy: { [orderBy]: order }
        }),
        model.count({ where })
    ]);

    return { data, count };
}


export async function getRecord(id) {
    try {
        const model = getModel();
        return await model.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                site_key: true,
                site_name: true,
                site_logo: true,
                site_favicon: true,
                short_intro: true,
                copyright_text: true,
                created_at: true,
                updated_at: true
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function storeRecord(payload) {
    try {
        const model = getModel();
        return await model.create({
            data: payload,
            select: {
                id: true,
                site_key: true,
                site_name: true,
                site_logo: true,
                site_favicon: true,
                short_intro: true,
                copyright_text: true,
                created_at: true,
                updated_at: true
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateRecord(id, payload) {
    try {
        const model = getModel();
        return await model.update({
            where: { id: Number(id) },
            data: payload,
            select: {
                id: true,
                site_key: true,
                site_name: true,
                site_logo: true,
                site_favicon: true,
                short_intro: true,
                copyright_text: true,
                created_at: true,
                updated_at: true
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteRecord(id) {
    try {
        const model = getModel();
        if (SOFT_DELETE) {
            return await model.update({
                where: { id: Number(id) },
                data: {
                    status: STATUS_DELETED,
                    deleted_at: new Date()
                },
            });
        }

        return await model.delete({
            where: { id: Number(id) },
            select: { id: true }
        });

    } catch (error) {

        if (error.code === "P2003") {
            throw new Error(
                "This record cannot be deleted because it is linked to other data. Remove or update related records first."
            );
        }

        throw new Error(error.message || "Failed to delete record");
    }
}


// Public

export async function getRecordBySiteKey(site_key) {
    try {
        const model = getModel();
        return await model.findUnique({
            where: { site_key: site_key },
            select: {
                id: true,
                site_key: true,
                site_name: true,
                site_logo: true,
                site_favicon: true,
                short_intro: true,
                copyright_text: true,
                created_at: true,
                updated_at: true
            }
        });
    } catch (err) {
        console.log("err", err);

        throw new Error(err.message);
    }
}