import path from "node:path";
import process from "node:process";
import url from "node:url";

// Path to Hugo Directory
export const hugoDirectory = path.join(
    url.fileURLToPath(new URL("vendor/", import.meta.url)),
);

// Actual execution path based on platform
const hugoPath =
    process.platform === "win32"
        ? `${hugoDirectory}hugo.exe`
        : `${hugoDirectory}hugo`;

export default hugoPath;
