import { StoreController } from "server/controllers/store.controller";

export async function POST(req, context) {
    const { id } = await context.params;
    return StoreController.cloneStore(req, id);
}

