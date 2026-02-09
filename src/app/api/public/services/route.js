import { ServiceController } from "server/controllers/service.controller";

// Disable caching to ensure fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
    return ServiceController.getServices(req);
}

