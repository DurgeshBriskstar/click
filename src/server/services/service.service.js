import { prisma } from "lib/prismaClient";
import { STATUS_ACTIVE, STATUS_DELETED } from "utils/constants";
import { ensureModel } from "server/utils/modelGuard";

const model = prisma?.services;
const SOFT_DELETE = process.env.SOFT_DELETE_SYSTEM === "true";

export async function getRecords({ search, page, order, orderBy, rowsPerPage }) {
    const mdl = ensureModel(model, "services");

    const skip = (page - 1) * rowsPerPage;
    const take = rowsPerPage;

    const where = {
        deleted_at: null,
        ...(search
            ? {
                OR: [
                    { service_name: { contains: search.toLowerCase() } }
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
    const mdl = ensureModel(model, "services");
    return await mdl.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            service_name: true,
            service_slug: true,
            short_description: true,
            image: true,
            icon: true,
            highlights: true,
            layout_code: true,
            sections: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });
}

export async function storeRecord(payload) {
    try {
        const mdl = ensureModel(model, "services");
        // Process highlights - ensure it's JSON format
        const processedPayload = {
            ...payload,
            service_slug: payload.service_slug || null,
            short_description: payload.short_description || null,
            highlights: payload.highlights ? (Array.isArray(payload.highlights) ? payload.highlights : null) : null,
            layout_code: payload.layout_code || null,
            sections: payload.sections || null
        };

        return await mdl.create({
            data: processedPayload,
            select: {
                id: true,
                service_name: true,
                service_slug: true,
                short_description: true,
                image: true,
                icon: true,
                highlights: true,
                layout_code: true,
                sections: true,
                status: true,
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
        const mdl = ensureModel(model, "services");
        const processedPayload = {
            ...payload,
            service_slug: payload.service_slug || null,
            short_description: payload.short_description || null,
            highlights: payload.highlights ? (Array.isArray(payload.highlights) ? payload.highlights : null) : null,
            layout_code: payload.layout_code || null,
            sections: payload.sections || null
        };

        return await mdl.update({
            where: { id: Number(id) },
            data: processedPayload,
            select: {
                id: true,
                service_name: true,
                service_slug: true,
                short_description: true,
                image: true,
                icon: true,
                highlights: true,
                layout_code: true,
                sections: true,
                status: true,
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
        const mdl = ensureModel(model, "services");
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

// Check if slug is unique (excluding a specific record for updates)
export async function isSlugUnique(slug, excludeId = null) {
    const mdl = ensureModel(model, "services");
    const where = {
        service_slug: slug,
        deleted_at: null,
    };

    if (excludeId) {
        where.id = { not: Number(excludeId) };
    }

    const existing = await mdl.findFirst({ where });
    return !existing;
}

// For Website Pages

export async function getActiveServicesRecords() {
    const mdl = ensureModel(model, "services");

    const where = {
        status: STATUS_ACTIVE
    };

    const [data, count] = await Promise.all([
        mdl.findMany({ where, orderBy: { ["service_name"]: "asc" } }),
        mdl.count({ where })
    ]);

    return { data, count };
}

export async function getServiceRecordBySlug(slug) {
    const mdl = ensureModel(model, "services");
    return await mdl.findFirst({
        where: {
            service_slug: slug,
            status: STATUS_ACTIVE,
            deleted_at: null
        },
        select: {
            id: true,
            service_name: true,
            service_slug: true,
            short_description: true,
            image: true,
            icon: true,
            highlights: true,
            layout_code: true,
            sections: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });
}