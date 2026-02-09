import { Prisma } from "@prisma/client";
import { prisma } from "lib/prismaClient";
import { STATUS_ACTIVE, STATUS_DELETED } from "utils/constants";
import { ensureModel } from "server/utils/modelGuard";

const model = prisma?.blogs; // optional because table/model might not exist yet
const SOFT_DELETE = process.env.SOFT_DELETE_SYSTEM === "true";

export async function getRecords({ search, page, order, orderBy, rowsPerPage }) {
    const mdl = ensureModel(model, "blogs");

    const skip = (page - 1) * rowsPerPage;
    const take = rowsPerPage;

    const where = {
        deleted_at: null,
        ...(search
            ? {
                OR: [
                    { title: { contains: search.toLowerCase() } },
                    { slug: { contains: search.toLowerCase() } },
                    { excerpt: { contains: search.toLowerCase() } },
                    { content: { contains: search.toLowerCase() } }
                ]
            }
            : {})
    };

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
    const mdl = ensureModel(model, "blogs");
    return await mdl.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            image: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });
}

export async function storeRecord(payload) {
    try {
        const mdl = ensureModel(model, "blogs");
        return await mdl.create({
            data: payload,
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                content: true,
                image: true,
                status: true,
                created_at: true,
                updated_at: true
            }
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                throw new Error("A blog post with this slug already exists. Please use a different slug.");
            }
        }
        throw new Error(err.message || "Failed to create blog post.");
    }
}

export async function updateRecord(id, payload) {
    try {
        const mdl = ensureModel(model, "blogs");
        return await mdl.update({
            where: { id: Number(id) },
            data: payload,
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                content: true,
                image: true,
                status: true,
                created_at: true,
                updated_at: true
            }
        });
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                throw new Error("A blog post with this slug already exists. Please use a different slug.");
            }
        }
        throw new Error(err.message || "Failed to update blog post.");
    }
}

export async function deleteRecord(id) {
    try {
        const mdl = ensureModel(model, "blogs");
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

// For Website Pages

export async function getActiveBlogRecords({ search, page = 1, order = "desc", orderBy = "created_at", rowsPerPage = 100 }) {
    const mdl = ensureModel(model, "blogs");

    const skip = (page - 1) * rowsPerPage;
    const take = rowsPerPage;

    const where = {
        status: STATUS_ACTIVE,
        ...(search
            ? {
                OR: [
                    { title: { contains: search.toLowerCase() } },
                    { slug: { contains: search.toLowerCase() } },
                    { excerpt: { contains: search.toLowerCase() } },
                    { content: { contains: search.toLowerCase() } }
                ]
            }
            : {})
    };

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

export async function getBlogRecordBySlug(slug) {
    const mdl = ensureModel(model, "blogs");
    return await mdl.findFirst({
        where: {
            slug: slug,
            status: STATUS_ACTIVE,
            deleted_at: null
        },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            image: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });
}


