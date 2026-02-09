import { BlogController } from "server/controllers/blog.controller";

export async function GET(req) {
    return BlogController.getBlogs(req);
}

export async function POST(req) {
    return BlogController.saveBlog(req);
}


