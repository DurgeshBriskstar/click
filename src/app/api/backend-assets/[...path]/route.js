import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PROJECT_UPLOAD_PATH } from "utils/server-constants";

// Disable Next.js caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
    try {
        const { path: filePath } = await params;

        if (!filePath || filePath.length === 0) {
            return new NextResponse("File path required", { status: 400 });
        }

        // Join the path segments
        const fullPath = path.join(PROJECT_UPLOAD_PATH, ...filePath);

        // Security: Ensure the file is within the upload directory
        const resolvedPath = path.resolve(fullPath);
        const resolvedUploadPath = path.resolve(PROJECT_UPLOAD_PATH);

        if (!resolvedPath.startsWith(resolvedUploadPath)) {
            console.error(`Access denied: ${resolvedPath} is outside ${resolvedUploadPath}`);
            return new NextResponse("Access denied", { status: 403 });
        }

        // Check if file exists
        if (!fs.existsSync(resolvedPath)) {
            console.error(`File not found: ${resolvedPath}`);
            console.error(`Looking in: ${PROJECT_UPLOAD_PATH}`);
            console.error(`Requested path segments:`, filePath);
            return new NextResponse("File not found", { status: 404 });
        }

        // Read the file
        const fileBuffer = fs.readFileSync(resolvedPath);

        // Determine content type based on file extension
        const ext = path.extname(resolvedPath).toLowerCase();
        const contentTypeMap = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
            ".webp": "image/webp",
            ".ico": "image/x-icon",
            ".pdf": "application/pdf",
            ".txt": "text/plain",
        };

        const contentType = contentTypeMap[ext] || "application/octet-stream";

        // Return the file with appropriate headers
        // Use no-cache to ensure images update immediately when changed
        // Add ETag for conditional requests
        const stats = fs.statSync(resolvedPath);
        const etag = `"${stats.mtime.getTime()}-${stats.size}"`;
        
        // Check if client has cached version
        const ifNoneMatch = request.headers.get("if-none-match");
        if (ifNoneMatch === etag) {
            return new NextResponse(null, { status: 304 });
        }

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                "Pragma": "no-cache",
                "Expires": "0",
                "ETag": etag,
                "Last-Modified": stats.mtime.toUTCString(),
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (error) {
        console.error("Error serving file:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

