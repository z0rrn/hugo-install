import path from "node:path";
import process from "node:process";
import url from "node:url";
import fs from "node:fs/promises";
import decompress from "decompress";
import { packageConfig } from "package-config";

// Get namespaced config for hugo-install
const config = await packageConfig("hugo-install");

// Set path to download to
const targetDirectory = path.join(
  url.fileURLToPath(new URL("vendor/", import.meta.url)),
);

// Append compressed file
const compressedFile =
  process.platform === "win32"
    ? `${targetDirectory}hugo.zip`
    : `${targetDirectory}hugo.tar.gz`;
// Append extracted file
const extractedFile =
  process.platform === "win32"
    ? `${targetDirectory}hugo.exe`
    : `${targetDirectory}hugo`;

// Specify filemap of downloadable files
const downloadFileMap = {
  darwin: {
    arm64: `hugo_extended_${config.hugoVersion}_darwin-universal.tar.gz`,
    x64: `hugo_extended_${config.hugoVersion}_darwin-universal.tar.gz`,
  },
  dragonflybsd: {
    x64: `hugo_${config.hugoVersion}_dragonfly-amd64.tar.gz`,
  },
  freebsd: {
    x64: `hugo_${config.hugoVersion}_freebsd-amd64.tar.gz`,
  },
  linux: {
    x64: `hugo_extended_${config.hugoVersion}_linux-amd64.tar.gz`,
    arm: `hugo_${config.hugoVersion}_linux-arm.tar.gz`,
    arm64: `hugo_extended_${config.hugoVersion}_linux-arm64.tar.gz`,
  },
  netbsd: {
    x64: `hugo_${config.hugoVersion}_netbsd-amd64.tar.gz`,
  },
  openbsd: {
    x64: `hugo_${config.hugoVersion}_openbsd-amd64.tar.gz`,
  },
  solaris: {
    x64: `hugo_${config.hugoVersion}_solaris-amd64.tar.gz`,
  },
  win32: {
    x64: `hugo_extended_${config.hugoVersion}_windows-amd64.zip`,
    arm64: `hugo_${config.hugoVersion}_windows-arm64.zip`,
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
    config.URL,
  ].find(Boolean) ||
  `https://github.com/gohugoio/hugo/releases/download/v${config.hugoVersion}/${downloadFile}`;

// Function to download file
// variable names all lowercase
const download = async (
  downloadurl,
  targetdirectory,
  compressedfile,
  extractedfile,
  callback,
) => {
  // Create folder, no error if folder exists
  try {
    await fs.mkdir(targetdirectory);
    console.log(`Folder ${targetdirectory} created!`);
  } catch {
    console.log(`Folder ${targetdirectory} already created!`);
  }

  // Fetch file and throw error if response isn't ok
  const response = await fetch(downloadurl);

  if (!response.ok) {
    throw new Error(`Unexpected response ${response.statusText}!`);
  }

  // Write file to buffer -> file
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(compressedfile, buffer);
  console.log(`Compressed file downloaded to ${compressedfile}`);

  // Call extract function so that it's executed after this
  callback(compressedfile, targetdirectory, extractedfile);
};

// Extract the tar.gz/zip to vendor folder
const extract = async (compressedfile, targetdirectory, extractedfile) => {
  try {
    await decompress(compressedfile, targetdirectory);
    console.log(`Hugo successfully installed to: ${extractedfile}!`);
  } catch (error) {
    // Give output on error
    console.log(`Failed to install hugo: ${error}`);
  }
};

// Call download and extract function
download(
  downloadUrl,
  targetDirectory,
  compressedFile,
  extractedFile,
  extract,
).catch(console.error);
