import { PartnerController } from "server/controllers/partner.controller";

export async function GET(req) {
    return PartnerController.getPartners(req);
}

export async function POST(req) {
    return PartnerController.savePartner(req);
}

