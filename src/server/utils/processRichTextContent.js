"use server";

import { saveBase64File } from "./saveBase64File";

/**
 * Process rich text content (HTML) to extract base64 images, upload them, and replace with server paths
 * @param {string} htmlContent - HTML content that may contain base64 images
 * @param {string} folder - Folder name where images should be saved (e.g., "blogs", "cms-pages")
 * @param {string} prefix - Prefix for image filenames (e.g., "img", "content")
 * @returns {Promise<string>} - Processed HTML content with base64 images replaced by server paths
 */
export async function processRichTextContent(htmlContent, folder, prefix = "img") {
    if (!htmlContent || typeof htmlContent !== "string") {
        return htmlContent || "";
    }

    // Regular expression to match img tags with base64 src attributes
    const base64ImageRegex = /<img[^>]+src=["'](data:image\/[^;]+;base64,[^"']+)["'][^>]*>/gi;

    // Find all base64 images
    const matches = [...htmlContent.matchAll(base64ImageRegex)];

    if (matches.length === 0) {
        return htmlContent; // No base64 images found, return as is
    }

    let processedContent = htmlContent;

    // Process each base64 image
    for (const match of matches) {
        const fullMatch = match[0]; // Full img tag
        const base64Data = match[1]; // Base64 data URL

        try {
            // Check if this is already a server path (starts with /backend-assets)
            if (base64Data.startsWith("/backend-assets")) {
                continue; // Skip already processed images
            }

            // Upload the base64 image
            const fileName = await saveBase64File(
                base64Data,
                folder,
                prefix
            );

            // Create the server path
            const serverPath = `/backend-assets/${folder}/${fileName}`;

            // Replace base64 src with server path in the img tag
            const updatedImgTag = fullMatch.replace(
                /src=["']data:image\/[^;]+;base64,[^"']+["']/i,
                `src="${serverPath}"`
            );

            // Replace in the content
            processedContent = processedContent.replace(fullMatch, updatedImgTag);
        } catch (error) {
            console.error("Error processing base64 image:", error);
            // Continue processing other images even if one fails
        }
    }

    return processedContent;
}

