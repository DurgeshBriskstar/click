import { prisma } from "lib/prismaClient";
import { STATUS_ACTIVE, STATUS_DELETED } from "utils/constants";
import { ensureModel } from "server/utils/modelGuard";
import bcrypt from "bcryptjs";

const model = prisma?.users;
const SOFT_DELETE = process.env.SOFT_DELETE_SYSTEM === "true";

export async function getRecords({ search, page, order, orderBy, rowsPerPage }) {
    const mdl = ensureModel(model, "users");

    const skip = (page - 1) * rowsPerPage;
    const take = rowsPerPage;

    const where = {
        is_deleted: null,
        ...(search
            ? {
                OR: [
                    { first_name: { contains: search.toLowerCase() } },
                    { last_name: { contains: search.toLowerCase() } },
                    { email: { contains: search.toLowerCase() } }
                ]
            }
            : {})
    };

    const [data, count] = await Promise.all([
        mdl.findMany({
            where,
            skip,
            take,
            orderBy: { [orderBy]: order },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                image: true,
                role: true,
                highlevel_franchise_access_token: true,
                highlevel_franchise_form_id: true,
                status: true,
                store_id: true,
                stores: {
                    select: {
                        store_name: true
                    }
                },
                created_at: true,
                updated_at: true
            }
        }),
        mdl.count({ where })
    ]);

    return { data, count };
}


export async function getRecord(id) {
    const mdl = ensureModel(model, "users");
    return await mdl.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            highlevel_franchise_access_token: true,
            highlevel_franchise_form_id: true,
            status: true,
            store_id: true,
            stores: {
                select: {
                    store_name: true
                }
            },
            created_at: true,
            updated_at: true
        }
    });
}

export async function storeRecord(payload) {
    try {
        const mdl = ensureModel(model, "users");

        // Hash password
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        const processedPayload = {
            first_name: payload.first_name,
            last_name: payload.last_name || null,
            email: payload.email,
            phone: payload.phone || null,
            image: payload.image || null,
            password: hashedPassword,
            role: payload.role,
            status: payload.status ?? STATUS_ACTIVE,
        };

        // Handle store relation
        if (payload.store_id) {
            processedPayload.stores = {
                connect: { id: Number(payload.store_id) }
            };
        }

        return await mdl.create({
            data: processedPayload,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                image: true,
                role: true,
                highlevel_franchise_access_token: true,
                highlevel_franchise_form_id: true,
                status: true,
                store_id: true,
                stores: {
                    select: {
                        store_name: true
                    }
                },
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
        const mdl = ensureModel(model, "users");

        const processedPayload = {
            first_name: payload.first_name,
            last_name: payload.last_name || null,
            phone: payload.phone || null,
            role: payload.role,
            status: payload.status,
            updated_at: new Date(),
        };

        // Handle store relation
        if (payload.store_id) {
            processedPayload.stores = {
                connect: { id: Number(payload.store_id) }
            };
        } else if (payload.store_id === null) {
            processedPayload.stores = {
                disconnect: true
            };
        }

        // Only update password if provided
        if (payload.password) {
            processedPayload.password = await bcrypt.hash(payload.password, 10);
        }

        // Only update image if provided
        if (payload.image !== undefined) {
            processedPayload.image = payload.image;
        }

        return await mdl.update({
            where: { id: Number(id) },
            data: processedPayload,
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
                image: true,
                role: true,
                highlevel_franchise_access_token: true,
                highlevel_franchise_form_id: true,
                status: true,
                store_id: true,
                stores: {
                    select: {
                        store_name: true
                    }
                },
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
        const mdl = ensureModel(model, "users");
        if (SOFT_DELETE) {
            return await mdl.update({
                where: { id: Number(id) },
                data: {
                    status: STATUS_DELETED,
                    is_deleted: new Date()
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

export async function isEmailUnique(email, excludeId = null) {
    const mdl = ensureModel(model, "users");
    const where = {
        email: email,
        is_deleted: null,
    };

    if (excludeId) {
        where.id = { not: Number(excludeId) };
    }

    const existing = await mdl.findFirst({ where });
    return !existing;
}

