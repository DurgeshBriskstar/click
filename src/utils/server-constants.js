import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve project root (go up from src/utils to project root)
const projectRootFromFile = path.resolve(__dirname, "../..");

// Try to find project root by looking for package.json or next.config
function findProjectRoot() {
    // First, try the calculated path from file location
    const possibleRoots = [
        projectRootFromFile,
        process.cwd(),
    ];

    for (const root of possibleRoots) {
        const packageJsonPath = path.join(root, "package.json");
        const nextConfigPath = path.join(root, "next.config.ts");
        
        if (fs.existsSync(packageJsonPath) || fs.existsSync(nextConfigPath)) {
            return root;
        }
    }

    // Fallback to process.cwd() if nothing found
    return process.cwd();
}

const projectRoot = findProjectRoot();

export const PROJECT_UPLOAD_PATH = path.join(
    projectRoot,
    "public",
    "backend-assets"
);