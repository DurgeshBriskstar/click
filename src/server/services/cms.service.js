import { Prisma } from "@prisma/client";
import { prisma } from "lib/prismaClient";
import { STATUS_DELETED } from "utils/constants";
import { ensureModel } from "server/utils/modelGuard";

const model = prisma?.cms_pages;
const SOFT_DELETE = process.env.SOFT_DELETE_SYSTEM === "true";

export async function getRecords({ search, page, order, orderBy, rowsPerPage }) {
    const mdl = ensureModel(model, "cms_pages");

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
        mdl.findMany({
            where,
            skip,
            take,
            orderBy: { [orderBy]: order }
        }),
        mdl.count({ where })
    ]);

    return { data, count };
}


export async function getRecord(id) {
    try {
        const mdl = ensureModel(model, "cms_pages");
        return await mdl.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                title: true,
                page_key: true,
                slug: true,
                status: true,
                meta: true,
                sections: true,
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
        const mdl = ensureModel(model, "cms_pages");
        return await mdl.create({
            data: payload,
            select: {
                id: true,
                title: true,
                page_key: true,
                slug: true,
                status: true,
                meta: true,
                sections: true,
                created_at: true,
                updated_at: true
            }
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                throw new Error("This page already exists!");
            }
        }

        throw new Error("Failed to create page.");
    }
}

export async function updateRecord(id, payload) {
    try {
        const mdl = ensureModel(model, "cms_pages");
        return await mdl.update({
            where: { id: Number(id) },
            data: payload,
            select: {
                id: true,
                title: true,
                page_key: true,
                slug: true,
                status: true,
                meta: true,
                sections: true,
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
        const mdl = ensureModel(model, "cms_pages");
        if (SOFT_DELETE) {
            return await mdl.update({
                where: { id: Number(id) },
                data: {
                    status: STATUS_DELETED,
                    deleted_at: new Date()
                },
            });
        }

        return await mdl.delete({
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

export async function getRecordByPageKey(page_key) {
    const mdl = ensureModel(model, "cms_pages");
    return await mdl.findUnique({
        where: { page_key: page_key },
        select: {
            title: true,
            page_key: true,
            slug: true,
            status: true,
            meta: true,
            sections: true,
            created_at: true,
            updated_at: true
        }
    });
}