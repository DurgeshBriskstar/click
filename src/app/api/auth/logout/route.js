import { AuthController } from "server/controllers/auth.controller";

export async function GET() {
    return AuthController.logout();
}
