import { AuthController } from "server/controllers/auth.controller";

export async function GET(req) {
    return AuthController.userInfo(req);
}
