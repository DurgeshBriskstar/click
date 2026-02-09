import { prisma } from "lib/prismaClient";
import { STATUS_ACTIVE, STATUS_DELETED } from "utils/constants";
import { ensureModel } from "server/utils/modelGuard";

const SOFT_DELETE = process.env.SOFT_DELETE_SYSTEM === "true";

// Lazy-load model to prevent client-side bundling
function getModel() {
    if (typeof window !== "undefined") {
        throw new Error("This function can only be called on the server");
    }
    return prisma?.stores;
}

export async function getRecords({ search, page, order, orderBy, rowsPerPage }) {
    const mdl = ensureModel(getModel(), "stores");

    const skip = (page - 1) * rowsPerPage;
    const take = rowsPerPage;

    const where = {
        deleted_at: null,
        ...(search
            ? {
                OR: [
                    { store_name: { contains: search.toLowerCase() } }
                ]
            }
            : {})
    };

    const [data, count] = await Promise.all([
        mdl.findMany({
            where,
            skip,
            take,
            orderBy: [
                { is_primary_store: 'desc' },
                { [orderBy]: order }
            ]
        }),
        mdl.count({ where })
    ]);

    return { data, count };
}


export async function getRecord(id) {
    const mdl = ensureModel(getModel(), "stores");
    return await mdl.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            store_name: true,
            store_slug: true,
            image: true,
            sections: true,
            contact_us: true,
            social_links: true,
            settings: true,
            highlevel_location_id: true,
            highlevel_api_key: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });
}

export async function storeRecord(payload) {
    try {
        const mdl = ensureModel(getModel(), "stores");
        const processedPayload = {
            ...payload,
            store_slug: payload.store_slug || null,
        };
        return await mdl.create({
            data: processedPayload,
            select: {
                id: true,
                store_name: true,
                store_slug: true,
                image: true,
                sections: true,
                contact_us: true,
                social_links: true,
                settings: true,
                highlevel_location_id: true,
                highlevel_api_key: true,
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
        const mdl = ensureModel(getModel(), "stores");
        const processedPayload = {
            ...payload,
            store_slug: payload.store_slug || null,
        };
        return await mdl.update({
            where: { id: Number(id) },
            data: processedPayload,
            select: {
                id: true,
                store_name: true,
                store_slug: true,
                image: true,
                sections: true,
                contact_us: true,
                social_links: true,
                settings: true,
                highlevel_location_id: true,
                highlevel_api_key: true,
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
        const mdl = ensureModel(getModel(), "stores");
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
    const mdl = ensureModel(getModel(), "stores");
    const where = {
        store_slug: slug,
        deleted_at: null,
    };

    if (excludeId) {
        where.id = { not: Number(excludeId) };
    }

    const existing = await mdl.findFirst({ where });
    return !existing;
}

// Generate a unique slug by appending a number if needed
export async function generateUniqueText(baseText, field = "store_slug") {
    const mdl = ensureModel(getModel(), "stores");

    let text = baseText;
    let counter = 1;

    while (true) {
        const existing = await mdl.findFirst({
            where: {
                [field]: text,
                deleted_at: null,
            }
        });

        if (!existing) {
            return text;
        }

        text = `${baseText}-${counter}`;
        counter++;
    }
}

export async function cloneRecord(id) {
    try {
        const mdl = ensureModel(getModel(), "stores");

        const original = await mdl.findUnique({
            where: { id: Number(id) }
        });

        if (!original) {
            throw new Error("Record not found");
        }

        const newSlug = original.store_slug ? await generateUniqueText(original.store_slug, "store_slug") : null;
        const newName = original.store_name ? await generateUniqueText(original.store_name, "store_name") : null;

        // Create cloned record with modified title and slug
        const clonedData = {
            store_name: newName,
            store_slug: newSlug,
            image: original.image,
            sections: original.sections,
            contact_us: original.contact_us,
            social_links: original.social_links,
            settings: true,
            highlevel_location_id: original.highlevel_location_id,
            highlevel_api_key: original.highlevel_api_key,
            status: original.status,
        };

        return await mdl.create({
            data: clonedData,
            select: {
                id: true,
                store_name: true,
                store_slug: true,
                image: true,
                sections: true,
                contact_us: true,
                social_links: true,
                settings: true,
                highlevel_location_id: true,
                highlevel_api_key: true,
                status: true,
                created_at: true,
                updated_at: true
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}


// For Website Pages

export async function getActiveStoreRecords() {
    const mdl = ensureModel(getModel(), "stores");

    const where = { status: STATUS_ACTIVE, deleted_at: null };

    const [data, count] = await Promise.all([
        mdl.findMany({ where, }),
        mdl.count({ where })
    ]);

    return { data, count };
}

export async function getActivePrimaryStore() {
    const mdl = ensureModel(getModel(), "stores");

    return await mdl.findFirst({
        where: {
            status: STATUS_ACTIVE,
            deleted_at: null,
            is_primary_store: true
        },
        select: {
            id: true,
            store_name: true,
            store_slug: true,
            image: true,
            sections: true,
            contact_us: true,
            social_links: true,
            settings: true,
            is_primary_store: true,
            highlevel_location_id: true,
            highlevel_api_key: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });
}

export async function getRecordBySlug(slug) {
    const mdl = ensureModel(getModel(), "stores");
    return await mdl.findFirst({
        where: {
            store_slug: slug,
            status: STATUS_ACTIVE,
            deleted_at: null
        },
        select: {
            id: true,
            store_name: true,
            store_slug: true,
            image: true,
            sections: true,
            contact_us: true,
            social_links: true,
            settings: true,
            highlevel_location_id: true,
            status: true,
            created_at: true,
            updated_at: true
        }
    });
}

// Check if there is an existing primary store
export async function checkPrimaryRecord() {
    const mdl = ensureModel(getModel(), "stores");
    const primaryStore = await mdl.findFirst({
        where: {
            is_primary_store: true,
            deleted_at: null,
        },
        select: {
            id: true,
            store_name: true,
        }
    });
    return { hasPrimary: !!primaryStore, primaryStore };
}

// Make a store as primary (only one store can be primary at a time)
export async function makePrimaryRecord(id) {
    try {
        const mdl = ensureModel(getModel(), "stores");

        // First check if the store exists and is active
        const store = await mdl.findUnique({
            where: { id: Number(id) }
        });

        if (!store) {
            throw new Error("Store not found");
        }

        if (store.status !== STATUS_ACTIVE) {
            throw new Error("Only active stores can be marked as primary");
        }

        // Remove primary status from all other stores
        await mdl.updateMany({
            where: {
                is_primary_store: true,
                id: { not: Number(id) }
            },
            data: {
                is_primary_store: false
            }
        });

        // Set this store as primary
        return await mdl.update({
            where: { id: Number(id) },
            data: { is_primary_store: true },
            select: {
                id: true,
                store_name: true,
                store_slug: true,
                is_primary_store: true,
                status: true,
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}

