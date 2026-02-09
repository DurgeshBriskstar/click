import { CmsController } from "server/controllers/cms.controller";

// Disable caching to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req, context) {
    const { page_key } = await context.params;
    return CmsController.getPageByKey(req, page_key);
}

