import { QuickBooksController } from "server/controllers/quickbooks.controller";

export async function GET(req) {
    return QuickBooksController.initiateOAuth(req);
}

