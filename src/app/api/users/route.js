import { UserController } from "server/controllers/user.controller";

export async function GET(req) {
    return UserController.getUsers(req);
}

export async function POST(req) {
    return UserController.saveUser(req);
}
