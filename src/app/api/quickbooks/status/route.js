import { QuickBooksController } from "server/controllers/quickbooks.controller";

export async function GET(req) {
    return QuickBooksController.getConnectionStatus(req);
}

