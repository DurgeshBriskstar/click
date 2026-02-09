import { SiteController } from "server/controllers/site.controller";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const site_key = searchParams.get("site_key");


    if (site_key) {
        return await SiteController.getSiteByKey(site_key);
    }

    return SiteController.getSites(req);
}

export async function POST(req) {
    return SiteController.saveSite(req);
}


