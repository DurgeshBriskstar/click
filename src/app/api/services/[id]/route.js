import { ServiceController } from "server/controllers/service.controller";

export async function GET(req, context) {
    const { id } = await context.params;
    return ServiceController.getService(req, id);
}

export async function PUT(req, context) {
    const { id } = await context.params;
    return ServiceController.updateService(req, id);
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    return ServiceController.deleteService(req, id);
}