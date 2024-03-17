import path from "node:path";
import process from "node:process";
import url from "node:url";
import fs from "node:fs/promises";
import decompress from "decompress";
import { packageConfig } from "package-config";

// Get namespaced config for hugo-install
const config = await packageConfig("hugo-install");

// Set path to download to (./node_modules/hugo-install/vendor/)
const targetDirectory = path.join(
  url.fileURLToPath(new URL("vendor/", import.meta.url)),
);

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

// Create folder, no error if folder exists
try {
  await fs.mkdir(targetDirectory);
  console.log(`Folder ${targetDirectory} created`);
} catch {
  console.log(`Folder ${targetDirectory} already created`);
}

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
    targetDirectory,
  );
  console.log(
    `Hugo installed to ${targetDirectory} (as hugo.exe (Windows) or hugo (everything else))`,
  );
} catch (error) {
  throw new Error(`Failed to download and decompress Hugo: ${error}`);
}
