"use server";

import fs from "fs";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";
import { PROJECT_UPLOAD_PATH } from "utils/server-constants";

function generateUniqueFile(prefix, ext) {
    const unique = crypto.randomBytes(8).toString("hex");
    return `${prefix}_${Date.now()}_${unique}.${ext}`;
}

export async function saveBase64File(
    base64String,
    folder,
    prefix = "doc",
    width = 0,
    height = 0
) {
    if (!base64String) throw new Error("Base64 string missing");

    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid base64 string format");

    const mimeType = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, "base64");

    const ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/svg+xml": "svg",
    }[mimeType] || mimeType.split("/")[1] || "bin";

    // Ensure the upload path exists (in serverless, PROJECT_UPLOAD_PATH is already /tmp/backend-assets)
    if (!fs.existsSync(PROJECT_UPLOAD_PATH)) {
        fs.mkdirSync(PROJECT_UPLOAD_PATH, { recursive: true });
    }

    const baseFolder = path.join(PROJECT_UPLOAD_PATH, folder);
    if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder, { recursive: true });
    }

    const fileName = generateUniqueFile(prefix, ext);

    if (!width || !height || ext === "svg" || ext === "gif") {
        const savePath = path.join(baseFolder, fileName);
        try {
            fs.writeFileSync(savePath, data, "base64");
            // Log for debugging (remove in production if needed)
            if (process.env.NODE_ENV === "development") {
                console.log(`File saved successfully: ${savePath}`);
            }
            return fileName;
        } catch (error) {
            console.error(`Error saving file to ${savePath}:`, error);
            throw new Error(`Failed to save file: ${error.message}`);
        }
    }

    const originalDir = path.join(baseFolder, "original");
    const resizedDir = path.join(baseFolder, "resized");

    if (!fs.existsSync(originalDir)) fs.mkdirSync(originalDir, { recursive: true });
    if (!fs.existsSync(resizedDir)) fs.mkdirSync(resizedDir, { recursive: true });

    const originalPath = path.join(originalDir, fileName);
    const resizedPath = path.join(resizedDir, fileName);

    try {
        fs.writeFileSync(originalPath, data, "base64");
        // Log for debugging (remove in production if needed)
        if (process.env.NODE_ENV === "development") {
            console.log(`Original file saved: ${originalPath}`);
        }
    } catch (error) {
        console.error(`Error saving original file to ${originalPath}:`, error);
        throw new Error(`Failed to save original file: ${error.message}`);
    }

    try {
        await sharp(buffer)
            .rotate()
            .resize(width, height, {
                fit: "contain",
                background: "#ffffff",
                withoutEnlargement: true,
            })
            .toFile(resizedPath);
        if (process.env.NODE_ENV === "development") {
            console.log(`Resized file saved: ${resizedPath}`);
        }
    } catch (err) {
        console.warn("Resize failed → copying original:", err);
        try {
            fs.copyFileSync(originalPath, resizedPath);
        } catch (copyError) {
            console.error(`Error copying file: ${copyError.message}`);
            throw new Error(`Failed to create resized file: ${copyError.message}`);
        }
    }

    return {
        original: fileName,
        resized: fileName,
    };
}
