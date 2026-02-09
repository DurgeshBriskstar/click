import { FaqController } from "server/controllers/faq.controller";

export async function GET(req) {
    return FaqController.getFaqs(req);
}

export async function POST(req) {
    return FaqController.saveFaq(req);
}

