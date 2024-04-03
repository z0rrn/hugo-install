# hugo-install

[![npm version](https://img.shields.io/npm/v/hugo-install?logo=npm&logoColor=fff&labelColor=000000)](https://www.npmjs.com/package/hugo-install)
[![Build Status](https://img.shields.io/github/actions/workflow/status/z0rrn/hugo-install/publish.yml?logo=github&logoColor=fff&labelColor=000000)](https://github.com/z0rrn/hugo-install/actions)

> Automagically install Hugo (<https://gohugo.io>) as part of `npm install` without using got.

Hugo is one of the most popular and best static site generators. If you read this, you chose npm as your package manager.
However, Hugo is written in [Go](https://go.dev) and not installable with npm.

Don't worry, **Hugo Install**, is a JS script which downloads the correct Hugo binary, e.g. via the `postinstall` script automagically as part of `npm install`. Nice!

The JS script installs the [extended Hugo version](https://github.com/gohugoio/hugo/releases/tag/v0.43) if possible (because it was much easier to code).
For usage within corporate networks or behind corporate proxies, the [download url](#download-url) can of course be overwritten.

## How to install

Run the following command to add **hugo-install** to your `devDependencies` in package.json.

```sh
npm install hugo-install --save-dev
```

All other Javascript package manager also work (this package is developed with Bun).

### Requirements

This project uses native fetch, so you need nodejs version >= 18.0.0.

## How to use

I recommend to run the script as part of your `postinstall` script. The Hugo version must be set using the `--version`/`-v` CLI argument. For example:

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "postinstall": "hugo-install -v 0.123.2"
  }
}
```

> Important: Make sure to use the exact version number as used in the [official Hugo GitHub releases](https://github.com/gohugoio/hugo/releases) (e.g. trailing zeros that exist or do not exist).

### Download URL

hugo-install supports overwriting the download url. There are multiple ways to do this:

#### As CLI argument

Pass the `--url`/`-u` CLI argument.

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "postinstall": "hugo-install -v 0.123.2 -u https://example.com/hugo/v0.123.2/hugo_0.123.2_freebsd-amd64.tar.gz"
  }
}
```

#### As local or global [.npmrc](https://docs.npmjs.com/files/npmrc) configuration file

```ini
hugo_install_url = "https://example.com/hugo/v0.123.2/hugo_0.123.2_freebsd-amd64.tar.gz"
```

#### As environment variables

```sh
export HUGO_INSTALL_URL="https://example.com/hugo/v0.123.2/hugo_0.123.2_freebsd-amd64.tar.gz"
```

**Note that you have to run the `postinstall` script again with `npm install`.**

## Using the Hugo Binary

When the binary is fetched, it is usable as command, as part of an npm script or from within another JS script.

### As command (only works on \*nix)

Set `alias hugo="npm run hugo` in your shell. Then nothing changes in your workflow.

### `npm run` scripts

The first script is required. The others are to make your life easier.

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "hugo": "hugo",
    "build": "hugo",
    "new": "hugo new",
    "serve": "hugo server"
  }
}
```

To create a new post run:

```sh
npm run create content post/my-new-post.md
```

### JS

To execute the Hugo Binary using the Node.JS `spawn` function do for example this:

<!-- prettier-ignore -->
```javascript
import { spawn } from "node:child_process";
import hugoPath from "hugo-install";

spawn(hugoPath, ["--config=path/to/config.toml"], {
  stdio: "inherit",
}).on("exit", () => {
  // Callback
});
```

## Super Inspired By

<!-- prettier-ignore -->
- [fenneclab/hugo-bin](https://github.com/fenneclab/hugo-bin)
- [brombal/just-install](https://github.com/brombal/just-install)
- [dominique-mueller/hugo-installer](https://github.com/dominique-mueller/hugo-installer)

**Thank you!**

## License

[MIT](LICENSE) © Frederik Zorn

Made with :heart:
