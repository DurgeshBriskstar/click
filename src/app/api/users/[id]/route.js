import { UserController } from "server/controllers/user.controller";

export async function GET(req, context) {
    const { id } = await context.params;
    return UserController.getUser(req, id);
}

export async function PUT(req, context) {
    const { id } = await context.params;
    return UserController.updateUser(req, id);
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    return UserController.deleteUser(req, id);
}

