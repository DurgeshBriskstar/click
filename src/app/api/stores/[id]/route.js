import { StoreController } from "server/controllers/store.controller";

export async function GET(req, context) {
    const { id } = await context.params;
    return StoreController.getStore(req, id);
}

export async function PUT(req, context) {
    const { id } = await context.params;
    return StoreController.updateStore(req, id);
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    return StoreController.deleteStore(req, id);
}

