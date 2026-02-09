import { PartnerController } from "server/controllers/partner.controller";

export async function GET(req, context) {
    const { id } = await context.params;
    return PartnerController.getPartner(req, id);
}

export async function PUT(req, context) {
    const { id } = await context.params;
    return PartnerController.updatePartner(req, id);
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    return PartnerController.deletePartner(req, id);
}

