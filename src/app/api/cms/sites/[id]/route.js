import { SiteController } from "server/controllers/site.controller";

export async function GET(req, context) {
    const { id } = await context.params;
    return SiteController.getSite(req, id);
}

export async function PUT(req, context) {
    const { id } = await context.params;
    return SiteController.updateSite(req, id);
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    return SiteController.deleteSite(req, id);
}