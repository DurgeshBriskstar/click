import { AuthController } from "server/controllers/auth.controller";

export async function POST(req) {
    return AuthController.resetPassword(req);
}

