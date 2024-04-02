import process from "node:process";
import fs from "node:fs/promises";
import decompress from "decompress";
import { Command } from "commander";
// Import Path to Hugo Directory
import { hugoDirectory } from "../main.js";

// Parse command arguments
const cliArguments = new Command();
// Specify arguments (how to use, description?, default value?)
cliArguments
    .requiredOption("-v, --version <version>", "Hugo version to install")
    .option(
        "-u, --URL <url>",
        "URL to download Hugo from (defaults to GitHub) (example: <https://example.com/hugo/v0.123.2/hugo_0.123.2_freebsd-amd64.tar.gz>)",
    );
// Important! Parse arguments and throws Error if required arguments are missing
cliArguments.parse(process.argv);
// Get arguments as object
const cliConfig = cliArguments.opts();

// Specify filemap of downloadable files
const downloadFileMap = {
    darwin: {
        arm64: `hugo_extended_${cliConfig.version}_darwin-universal.tar.gz`,
        x64: `hugo_extended_${cliConfig.version}_darwin-universal.tar.gz`,
    },
    dragonflybsd: {
        x64: `hugo_${cliConfig.version}_dragonfly-amd64.tar.gz`,
    },
    freebsd: {
        x64: `hugo_${cliConfig.version}_freebsd-amd64.tar.gz`,
    },
    linux: {
        x64: `hugo_extended_${cliConfig.version}_linux-amd64.tar.gz`,
        arm: `hugo_${cliConfig.version}_linux-arm.tar.gz`,
        arm64: `hugo_extended_${cliConfig.version}_linux-arm64.tar.gz`,
    },
    netbsd: {
        x64: `hugo_${cliConfig.version}_netbsd-amd64.tar.gz`,
    },
    openbsd: {
        x64: `hugo_${cliConfig.version}_openbsd-amd64.tar.gz`,
    },
    solaris: {
        x64: `hugo_${cliConfig.version}_solaris-amd64.tar.gz`,
    },
    win32: {
        x64: `hugo_extended_${cliConfig.version}_windows-amd64.zip`,
        arm64: `hugo_${cliConfig.version}_windows-arm64.zip`,
    },
};
// Set file based on platform
const downloadFile =
    downloadFileMap[process.platform] &&
    downloadFileMap[process.platform][process.arch];

// Set URL to download from (select first thruthy value or set to GitHub)
const downloadUrl =
    [
        process.env.HUGO_WRAPPER_URL,
        process.env.npm_config_hugo_wrapper_url,
        cliConfig.URL,
    ].find(Boolean) ||
    `https://github.com/gohugoio/hugo/releases/download/v${cliConfig.version}/${downloadFile}`;

// Create folder, ignore error if folder exists
await fs.mkdir(hugoDirectory);

// Download and decompress file (file to download, where to download to)
try {
    // Fetch file and throw error if response isn't ok
    const fetchedFile = await fetch(downloadUrl);
    if (!fetchedFile.ok) {
        throw new Error(`Unexpected response ${fetchedFile.statusText}`);
    }

    // Decompress directly from buffer
    await decompress(
        Buffer.from(await fetchedFile.arrayBuffer()),
        hugoDirectory,
    );
    console.log(
        `Hugo installed to ${hugoDirectory} (as hugo.exe (Windows) or hugo (everything else))`,
    );
} catch (error) {
    throw new Error(`Failed to download and decompress Hugo: ${error}`);
}
