import { ServiceController } from "server/controllers/service.controller";

export async function GET(req) {
    return ServiceController.getServices(req);
}

export async function POST(req) {
    return ServiceController.saveService(req);
}


