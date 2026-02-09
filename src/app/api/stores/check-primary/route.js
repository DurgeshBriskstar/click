import { StoreController } from "server/controllers/store.controller";

export async function GET(req) {
    return StoreController.checkPrimaryStore(req);
}

