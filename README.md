# hugo-install

[![npm version](https://img.shields.io/npm/v/hugo-install?logo=npm&logoColor=fff&labelColor=000000&color=ff3eec)](https://www.npmjs.com/package/hugo-install) [![Build Status](https://img.shields.io/github/actions/workflow/status/z0rrn/hugo-install/publish.yml?logo=github&logoColor=fff&labelColor=000000&color=ff3eec)](https://github.com/z0rrn/hugo-install/actions)

> Install the Hugo SSG (https://gohugo.io) as part of `npm install` without using got.

- hugo-install installs the [Extended Hugo version](https://github.com/gohugoio/hugo/releases/tag/v0.43)
- You must specify the Hugo version in your [package.json](#install)
- For usage within corporate networks or behind corporate proxies, the [download url](#download-url) can be overwritten

## Install

First you need to specify the desired Hugo version (will fail if not set). If you forget this just rerun the install command.

```json
}
  "hugo-install": {
    "hugoVersion": "0.123.2"
  }
}
```

```sh
npm install hugo-install --save-dev
```

All other package manager (like [Pnpm](https://pnpm.io/), [Yarn](https://yarnpkg.com/), [Bun](https://bun.sh) or [Deno](https://deno.com)) should also work (this package is developed with Bun).

If for misterious reasons this didn't install Hugo you can run the install script directly: `node node_modules/hugo-install/install.js`.

If you use Bun you need to add this to your package.json to [allow the postinstall script](https://bun.sh/docs/cli/install#lifecycle-scripts). Then just rerun the install.

```json
{
  "trustedDependencies": ["hugo-install"]
}
```

## Usage

### npm run-script

```json
{
  "scripts": {
    "hugo": "hugo",
    "build": "hugo",
    "create": "hugo new",
    "serve": "hugo server"
  }
}
```

I recommend setting `alias hugo="npm run hugo` on \*nix. Then nothing changes in your workflow.

Otherwise the scripts help you. E.g. to create a new post run:

```sh
npm run create content post/my-new-post.md
```

See the [Hugo Documentation](https://gohugo.io) for more information.

## Download URL

hugo-install supports overwriting the download url. There are multiple ways to do this:

### The `hugo-install` section of your `package.json`

```json
}
  "hugo-install": {
    "hugoVersion": "0.123.2",
    "URL": "https://example.com/hugo/v0.123.2/hugo_0.123.2_freebsd-amd64.tar.gz"
  }
}
```

### As local or global [.npmrc](https://docs.npmjs.com/files/npmrc) configuration file

```ini
hugo_wrapper_url = "https://example.com/hugo/v0.123.2/hugo_0.123.2_freebsd-amd64.tar.gz"
```

### As environment variables

```sh
export HUGO_WRAPPER_URL="https://example.com/hugo/v0.123.2/hugo_0.123.2_freebsd-amd64.tar.gz"
```

**Note that you have to run the install command to re-install hugo-install itself, if you change any of these options.**

### Options

#### hugoVersion

Default: `""`

Specify the Hugo version to download.

#### URL

Default: `"https://github.com/gohugoio/hugo/releases/download/v${config.hugoVersion}/${downloadFile}"`

Set it to your proxy URL to download the hugo binary from a different download repository.

## Super Inspired By

- [fenneclab/hugo-bin](https://github.com/fenneclab/hugo-bin)
- [brombal/just-install](https://github.com/brombal/just-install)

**Thank you!**

## License

[APACHE 2.0](LICENSE) © Frederik Zorn

Made with :heart:
