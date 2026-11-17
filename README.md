# organic-distillery

The website of [organic-distillery.com](https://www.organic-distillery.com/), rebuilt with SvelteKit 3, Svelte 5, TypeScript 6, Tailwind 4, unplugin-icons, Vitest and Bun.

The original German content lives in typed TypeScript modules and is rendered by Svelte components – no WordPress markup, theme CSS or jQuery is left. The look is an ornate ink/parchment/gold theme inspired by the engraved gin labels and botanical drawings, with a shop basket, working forms, a PWA install hint, automatic light/dark mode and a visual explanation of how the gin is made.

## Quick start

```sh
bun install
bun run dev      # http://localhost:5173
bun run ci       # format check, lint, type check, unit tests, static build
```

Root-relative links mean the site works on the apex and any subdomain, for example `http://www.localhost:5173`.

## Scripts

| Script                            | Purpose                                                           |
| --------------------------------- | ----------------------------------------------------------------- |
| `bun run dev` / `bun run preview` | Development / production preview server                           |
| `bun run build`                   | Prerender every page into `build/` via `adapter-static`           |
| `bun run check`                   | `svelte-kit sync`, Paraglide compile and `svelte-check`           |
| `bun run lint`                    | `bun lint` (ESLint plus Svelte rules)                             |
| `bun run format`                  | `bun fmt`                                                         |
| `bun run test`                    | Vitest unit tests                                                 |
| `bun run ci`                      | All of the above, in order                                        |
| `bun run images`                  | Re-run WebP conversion, bottle and herb cutouts                   |
| `bun run icons`                   | Regenerate the favicon and PWA icons from `static/icons/icon.svg` |
| `bun run i18n:compile`            | Compile Paraglide messages (`de`, `en`)                           |

## Project layout

```
scripts/                 one-off and maintenance tooling (Bun)
  optimize-images.ts     WebP conversion and transparent bottle cutouts
  generate-icons.ts      favicon / PWA icon rasterisation
src/
  app.html, app.d.ts     document shell and ambient types
  hooks*.ts              Paraglide middleware and URL rerouting
  routes/                SvelteKit routes; products under essenzen/[slug] and gins/[slug]
  lib/
    content/             typed content: pages, products, retailers, press, legal texts, site data
    features/            feature logic: age gate, basket, contact, newsletter, PWA, theme, aroma wheel
    ui/                  Svelte components (header, footer, product pages, recipes, forms)
    ui/blocks/           page building blocks (teaser, text band, feature, gallery, rich text)
    paraglide/           generated i18n runtime (git-ignored)
  styles/                Tailwind entry point and theme/motion/process layers
static/                  media, PDFs, fonts, icons and manifest
tests/                   unit and content-integrity tests
```

## Features

- **Content**: every page of the original site with its German copy, as typed data (`Page`, `Essence`, `Gin`, `Retailer`, `PressItem`, legal texts). Paragraphs are arrays of text runs, so nothing is rendered with `{@html}`. Old WordPress URLs such as `/essenzen/137-2` or `/gins/ginn-2` redirect to their new addresses.
- **Imagery**: all images are WebP; the gin and essence bottles are cut out from their studio backgrounds. Each essence page shows the herb drawing behind the bottle with a golden shimmer along its outline, a recipe section with the dish photo, dosages, drinks and Christine's note, and the aroma wheel. Gin pages list their botanicals with line drawings. All PDFs use one download button.
- **Shop**: product pages have add-to-basket controls with size/quantity selection; a persistent basket button opens a drawer with line items, totals and a prefilled email checkout. The basket persists in `localStorage`. `SHOP_MOCK_MODE=true` marks the checkout as a mock. The essences page offers all recipe cards as PDFs.
- **Forms**: validated contact form and newsletter registration that prepare prefilled emails (no backend required). The age gate persists confirmation in `localStorage`.
- **PWA**: manifest, icons, minimal service worker and an install hint using `beforeinstallprompt`.
- **Theme**: follows `prefers-color-scheme` with a footer toggle; ornate light/dark palettes, subtle animations and full `prefers-reduced-motion` support.
- **Telemetry**: cookieless Vercel Analytics page views plus typed custom events (recipe downloads, form submissions, theme changes, PWA install outcomes). Disabled in development; a disclosure is shown on the Datenschutz page.
- **Error pages**: a themed `+error.svelte` renders 404s and 500s without the site shell; `adapter-static` emits a `404.html` fallback so it also appears on static hosting.

## Editing content

Texts, products and lists live in `src/lib/content/*.ts`; TypeScript checks their shape against `src/lib/content/types.ts`. Images and PDFs go into `static/media/`; `bun run images` adds WebP versions and bottle cutouts for new JPEGs.

## Deploying to Vercel

Import the repository into Vercel. [vercel.json](vercel.json) installs with `bun install --frozen-lockfile`, builds with `bun run build` and serves the static `build/` output. Set `SHOP_MOCK_MODE=true` as a build environment variable if the deployed copy should use the local mock shop.

## Recreating the scaffold

This project started from the following `sv` configuration:

```sh
bun x sv@0.17.0 create --template minimal --types ts --add prettier eslint vitest="usages:unit" tailwindcss="plugins:none" paraglide="languageTags:de,en+demo:no" sveltekit-adapter="adapter:static" --no-download-check --install bun .
```

See the [SvelteKit documentation](https://svelte.dev/docs/kit) for framework details.
