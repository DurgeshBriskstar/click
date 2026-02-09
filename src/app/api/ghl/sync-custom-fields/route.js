import { GhlCustomFieldsController } from "server/controllers/ghlCustomFields.controller";

export async function POST(req) {
    return GhlCustomFieldsController.syncCustomFields(req);
}
