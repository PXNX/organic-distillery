# organic-distillery

A local replica of [organic-distillery.com](https://www.organic-distillery.com/), built with SvelteKit 3, Svelte 5, TypeScript 6, Tailwind 4 and Bun.

## Running the replica

```sh
bun install
bun run dev      # http://localhost:5173
bun run ci       # format check, lint, type check, tests and static build
```

The replica includes every HTML page crawlable from the homepage (25 pages), the original German content, header/footer, age gate and order popup. Images, PDFs, fonts, CSS and JS are mirrored into `static/`, so the site works offline. Root-relative links mean it works on the apex and any subdomain, e.g. `http://www.localhost:5173`.

## Refreshing the mirror

```sh
bun run mirror
```

This re-crawls the live site, rewrites internal URLs to local paths, refreshes `src/lib/content/site.json`, re-downloads assets and regenerates one route component per page. It needs network access.

## Shop mock mode

Set `SHOP_MOCK_MODE=true` when running `bun run dev` or `bun run build` to keep the order form local: submissions are intercepted, no WordPress POST is made, and a mock receipt is shown. See `.env.example`.

## Deploying to Vercel

Import the repository into Vercel. [vercel.json](vercel.json) tells Vercel to install with `bun install --frozen-lockfile`, build with `bun run build` (bun fmt/bun lint are part of `bun run ci`), and serve the static `build/` output produced by `adapter-static`. Set `SHOP_MOCK_MODE=true` as a build environment variable if the deployed copy should use the local mock shop instead of the original order endpoint.

## Project layout

| Path                                            | Purpose                                           |
| ----------------------------------------------- | ------------------------------------------------- |
| `scripts/mirror-site.ts`                        | Crawler, asset downloader and route generator     |
| `src/lib/content/site.json`                     | Mirrored page content and site shell              |
| `src/lib/components/MirroredPage.svelte`        | Renders a mirrored page inside the original shell |
| `src/routes/`                                   | One generated route per mirrored page             |
| `src/styles/app.css`                            | Global Tailwind styles                            |
| `static/media`, `static/fonts`, `static/vendor` | Mirrored assets                                   |
| `tests/`                                        | Content and asset integrity checks                |

---

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.17.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit" tailwindcss="plugins:none" paraglide="languageTags:de,en+demo:no" sveltekit-adapter="adapter:static" --no-download-check --install bun .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
