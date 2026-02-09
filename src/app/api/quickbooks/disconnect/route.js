import { QuickBooksController } from "server/controllers/quickbooks.controller";

export async function DELETE(req) {
    return QuickBooksController.disconnect(req);
}

