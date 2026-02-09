import { BlogController } from "server/controllers/blog.controller";

export async function GET(req, context) {
    const { id } = await context.params;
    return BlogController.getBlog(req, id);
}

export async function PUT(req, context) {
    const { id } = await context.params;
    return BlogController.updateBlog(req, id);
}

export async function DELETE(req, context) {
    const { id } = await context.params;
    return BlogController.deleteBlog(req, id);
}


