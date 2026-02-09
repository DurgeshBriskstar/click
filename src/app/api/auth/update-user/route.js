import { AuthController } from "server/controllers/auth.controller";

export async function PUT(req) {
    return AuthController.updateUser(req);
}