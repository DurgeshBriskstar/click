import { CmsController } from "server/controllers/cms.controller";

export async function GET(req) {
    return CmsController.getPages(req);
}

export async function POST(req) {
    return CmsController.savePage(req);
}


