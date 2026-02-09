import { CmsController } from "server/controllers/cms.controller";

export async function GET(req, context) {
    const { id } = await context.params;
    return CmsController.getPage(req, id);
}

export async function PUT(req, context) {
    const { id } = await context.params;
    return CmsController.updatePage(req, id);
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    return CmsController.deletePage(req, id);
}