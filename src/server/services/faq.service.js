import { prisma } from "lib/prismaClient";
import { STATUS_ACTIVE, STATUS_DELETED } from "utils/constants";
import { ensureModel } from "server/utils/modelGuard";

const model = prisma?.faqs;
const SOFT_DELETE = process.env.SOFT_DELETE_SYSTEM === "true";

export async function getRecords({ search, page, order, orderBy, rowsPerPage }) {
    const mdl = ensureModel(model, "faqs");

    const skip = (page - 1) * rowsPerPage;
    const take = rowsPerPage;

    const where = {
        deleted_at: null,
        ...(search
            ? {
                OR: [
                    { question: { contains: search.toLowerCase() } },
                    { answer: { contains: search.toLowerCase() } }
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

    // Get service names for FAQs that have service_id
    const serviceIds = [...new Set(data.filter(faq => faq.service_id).map(faq => faq.service_id))];
    let serviceMap = {};

    if (serviceIds.length > 0) {
        const services = await prisma.services.findMany({
            where: { id: { in: serviceIds } },
            select: { id: true, service_name: true }
        });
        serviceMap = services.reduce((acc, service) => {
            acc[service.id] = service.service_name;
            return acc;
        }, {});
    }

    // Attach service_name to each FAQ
    const dataWithServices = data.map(faq => ({
        ...faq,
        service_name: faq.service_id ? (serviceMap[faq.service_id] || "") : ""
    }));

    return { data: dataWithServices, count };
}


export async function getRecord(id) {
    const mdl = ensureModel(model, "faqs");
    return await mdl.findUnique({
        where: { id: Number(id) },
        select: {
            id: true,
            question: true,
            answer: true,
            status: true,
            show_on_stores: true,
            service_id: true,
            created_at: true,
            updated_at: true
        }
    });
}

export async function storeRecord(payload) {
    try {
        const mdl = ensureModel(model, "faqs");
        return await mdl.create({
            data: payload,
            select: {
                id: true,
                question: true,
                answer: true,
                status: true,
                show_on_stores: true,
                service_id: true,
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
        const mdl = ensureModel(model, "faqs");
        return await mdl.update({
            where: { id: Number(id) },
            data: payload,
            select: {
                id: true,
                question: true,
                answer: true,
                status: true,
                show_on_stores: true,
                service_id: true,
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
        const mdl = ensureModel(model, "faqs");
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

export async function getActiveFAQsRecords() {
    const mdl = ensureModel(model, "faqs");

    const where = { status: STATUS_ACTIVE };

    const [data, count] = await Promise.all([
        mdl.findMany({ where, }),
        mdl.count({ where })
    ]);

    return { data, count };
}

