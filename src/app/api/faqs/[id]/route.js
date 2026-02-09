import { FaqController } from "server/controllers/faq.controller";

export async function GET(req, context) {
    const { id } = await context.params;
    return FaqController.getFaq(req, id);
}

export async function PUT(req, context) {
    const { id } = await context.params;
    return FaqController.updateFaq(req, id);
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    return FaqController.deleteFaq(req, id);
}

