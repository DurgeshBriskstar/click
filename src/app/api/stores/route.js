import { StoreController } from "server/controllers/store.controller";

export async function GET(req) {
    return StoreController.getStores(req);
}

export async function POST(req) {
    return StoreController.saveStore(req);
}

