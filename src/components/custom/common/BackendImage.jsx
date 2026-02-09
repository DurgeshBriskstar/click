"use client";

import { getFileFullPath } from "utils/formats";

/**
 * Component to display images from backend-assets
 * Works with both Next.js Image and regular img tags
 * Handles the path resolution automatically
 */
export default function BackendImage({
    src,
    alt = "",
    useNextImage = false,
    ...props
}) {
    if (!src) return null;

    // Resolve the full path
    const imageSrc = getFileFullPath(src);

    // If it's a backend-assets path, use regular img tag (Next.js Image doesn't work well with API routes)
    const isBackendAsset = src.startsWith("/backend-assets");

    if (useNextImage && !isBackendAsset) {
        // Use Next.js Image for non-backend-assets images
        const Image = require("next/image").default;
        return <Image src={imageSrc} alt={alt} {...props} />;
    }

    // Use regular img tag for backend-assets (works with API route)
    return <img src={imageSrc} alt={alt} {...props} />;
}

