# organic-distillery

A local, offline-capable replica of [organic-distillery.com](https://www.organic-distillery.com/) built with SvelteKit 3, Svelte 5, TypeScript 6, Tailwind 4, Vitest and Bun.

The original German content is preserved, wrapped in an ornate ink/parchment/gold theme inspired by the engraved gin labels and botanical drawings. All 25 crawlable pages are present, plus working forms, a PWA install hint, automatic light/dark mode and a visual explanation of how the gin is made.

## Quick start

```sh
bun install
bun run dev      # http://localhost:5173
bun run ci       # format check, lint, type check, unit tests, static build
```

Root-relative links mean the site works on the apex and any subdomain, for example `http://www.localhost:5173`.

## Scripts

| Script                            | Purpose                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `bun run dev` / `bun run preview` | Development / production preview server                                        |
| `bun run build`                   | Prerender all 25 pages into `build/` via `adapter-static`                      |
| `bun run check`                   | `svelte-kit sync`, Paraglide compile and `svelte-check`                        |
| `bun run lint`                    | `bun lint` (ESLint plus Svelte rules)                                          |
| `bun run format`                  | `bun fmt`                                                                      |
| `bun run test`                    | Vitest unit tests                                                              |
| `bun run ci`                      | All of the above, in order                                                     |
| `bun run mirror`                  | Re-crawl the live site, download assets, regenerate routes and optimise images |
| `bun run images`                  | Re-run WebP conversion, bottle and herb cutouts                                |
| `bun run recipes`                 | Re-extract recipe text from the mirrored PDFs                                  |
| `bun run icons`                   | Regenerate the favicon and PWA icons from `static/icons/icon.svg`              |
| `bun run i18n:compile`            | Compile Paraglide messages (`de`, `en`)                                        |

## Project layout

```
scripts/                 one-off and maintenance tooling (Bun)
  mirror-site.ts         crawler, asset downloader and route generator
  optimize-images.ts     WebP conversion and transparent bottle cutouts
  generate-icons.ts      favicon / PWA icon rasterisation
src/
  app.html, app.d.ts     document shell and ambient types
  hooks*.ts              Paraglide middleware and URL rerouting
  routes/                SvelteKit routes (one generated +page.svelte per page)
  lib/
    content/             mirrored page data, botanical plates and recipe cards
    mirror/              pure crawl/transform helpers and content validation
    features/            feature logic: age gate, contact, newsletter, PWA, theme, shop
    ui/                  Svelte components (page renderer, forms, footer, process)
    paraglide/           generated i18n runtime (git-ignored)
  styles/                Tailwind entry point and theme/motion/process layers
static/                  mirrored media, fonts, vendor CSS/JS, icons and manifest
tests/                   unit and content-integrity tests
```

## Features

- **Mirror**: every page crawled from the homepage, with real German copy, original theme CSS/JS, fonts, images and all 15 recipe PDFs. Internal URLs are rewritten to local paths.
- **Imagery**: all mirrored images are WebP; the gin bottles have transparent cutouts, botanical drawings appear as framed specimen plates and the essences page includes a botanical gallery. Each essence detail page shows a full-screen, background-removed drawing of its herb behind the bottle, with a golden shimmer running along the outline only. The bottles themselves are cut out from their white studio backgrounds. Recipe PDFs are unpacked entirely into the repo: their text and images render in an always-visible, colour-tinted recipe section with a download button. The essences pages show a colour-coded SVG aroma wheel with the five flavour families, ten essences and their pairings.
- **Shop**: a persistent "Shop" action and clearly labelled order buttons open the order popup; recipe download cards and a recipe library are included. `SHOP_MOCK_MODE=true` keeps orders local and shows a mock receipt via a native `<dialog>`.
- **Forms**: validated contact form and newsletter registration that prepare prefilled emails (no backend required). The age gate persists confirmation in `localStorage`.
- **PWA**: manifest, icons, minimal service worker and an install hint using `beforeinstallprompt`.
- **Theme**: follows `prefers-color-scheme` with a footer toggle; ornate light/dark palettes, subtle animations and full `prefers-reduced-motion` support.
- **Telemetry**: cookieless Vercel Analytics page views plus typed custom events (recipe downloads, form submissions, theme changes, PWA install outcomes). Disabled in development; a disclosure is shown on the Datenschutz page.
- **Error pages**: a themed `+error.svelte` renders 404s and 500s without the site shell; `adapter-static` emits a `404.html` fallback so it also appears on static hosting.

## Refreshing the mirror

```sh
bun run mirror
```

This re-crawls the live site, refreshes `src/lib/content/site.json`, re-downloads assets, regenerates one route component per page, then converts images to WebP. It needs network access. Source JPEGs are kept beside the WebPs so cutouts can be regenerated.

## Deploying to Vercel

Import the repository into Vercel. [vercel.json](vercel.json) installs with `bun install --frozen-lockfile`, builds with `bun run build` and serves the static `build/` output. Set `SHOP_MOCK_MODE=true` as a build environment variable if the deployed copy should use the local mock shop.

## Recreating the scaffold

This project started from the following `sv` configuration:

```sh
bun x sv@0.17.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit" tailwindcss="plugins:none" paraglide="languageTags:de,en+demo:no" sveltekit-adapter="adapter:static" --no-download-check --install bun .
```

See the [SvelteKit documentation](https://svelte.dev/docs/kit) for framework details.
