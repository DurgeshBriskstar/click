import { prisma } from "lib/prismaClient";
import { STATUS_ACTIVE, STATUS_DELETED } from "utils/constants";
import { ensureModel } from "server/utils/modelGuard";

const model = prisma?.partners;
const SOFT_DELETE = process.env.SOFT_DELETE_SYSTEM === "true";

export async function getRecords({ search, page, order, orderBy, rowsPerPage }) {
    const mdl = ensureModel(model, "partners");

    const skip = (page - 1) * rowsPerPage;
    const take = rowsPerPage;

    const where = {
        deleted_at: null,
        ...(search
            ? {
                OR: [
                    { partner_name: { contains: search.toLowerCase() } },
                    { description: { contains: search.toLowerCase() } }
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
    const mdl = ensureModel(model, "partners");
    return await mdl.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            partner_name: true,
            image: true,
            description: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });
}

export async function storeRecord(payload) {
    try {
        const mdl = ensureModel(model, "partners");
        return await mdl.create({
            data: payload,
            select: {
                id: true,
                partner_name: true,
                image: true,
                description: true,
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
        const mdl = ensureModel(model, "partners");
        return await mdl.update({
            where: { id: Number(id) },
            data: payload,
            select: {
                id: true,
                partner_name: true,
                image: true,
                description: true,
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
        const mdl = ensureModel(model, "partners");
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

export async function getActivePartnersRecords() {
    const mdl = ensureModel(model, "partners");

    const where = { status: STATUS_ACTIVE };

    const [data, count] = await Promise.all([
        mdl.findMany({ where, }),
        mdl.count({ where })
    ]);

    return { data, count };
}
