# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Astro site (Astro 7) using Tailwind CSS v4 (`@tailwindcss/vite`), the React integration (`@astrojs/react`), and shadcn/ui (`base-nova` style, Base UI primitives). Node >=22.12.0 required.

## Commands

- `npm run dev` — start dev server (localhost:4321). Per the Development section below, prefer `astro dev --background` in this environment.
- `npm run build` — build production site to `./dist/`
- `npm run preview` — preview the production build locally
- `npm run astro check` — type-check `.astro` files
- `npm run astro -- <cmd>` — run any Astro CLI command (e.g. `astro add`)

There is no test suite or linter configured in this repository.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Architecture

Standard Astro file-based routing:

- `src/pages/` — routes; each `.astro` file maps to a URL path (`src/pages/index.astro` → `/`)
- `src/layouts/` — shared page shells (e.g. `Layout.astro`) that pages wrap their content in via `<slot />`
- `src/components/sections/` — one `.astro` file per page section (Hero, Pricing, etc.), composed together in `src/pages/index.astro`
- `src/components/site/` — site-wide chrome (Header, Footer, Container)
- `src/components/islands/` — the handful of React components that actually need client JS (see Hydration below); everything else in `src/components/` is plain `.astro`
- `src/components/ui/` — shadcn/ui primitives
- `src/data/site.ts` — page copy/content as typed data, imported by both `.astro` sections and islands
- `src/assets/` — images imported by components (processed by Astro's asset pipeline)
- `public/` — static files served as-is at the site root (e.g. favicon)

`tsconfig.json` extends `astro/tsconfigs/strict` and defines the `@/*` path alias for `./src/*` (required by shadcn/ui).

### UI components (shadcn/ui)

- `npx shadcn@latest add <component>` adds new components into `src/components/ui/`.
- Components are React (`.tsx`) using Base UI primitives (`@base-ui/react`) and CVA for variants; import via the `@/` alias (e.g. `@/components/ui/button`, `@/lib/utils`).
- Global styles/theme tokens live in `src/styles/global.css`; config is in `components.json`.

### Hydration: most of the page ships zero JS

A React component used in an `.astro` file **without** a `client:*` directive renders to static
HTML only — no hydration, no client JS shipped. Most shadcn components on this page (buttons,
cards, badges) are used exactly this way, even though they're React under the hood.

Only components with real client-side state (`src/components/islands/`) get a directive, and
they all use `client:visible` (not `client:load`) so nothing executes until the visitor scrolls
near it — see the README's [Tracking & instrumentation](./README.md#tracking--instrumentation)
section for the full list and why. Don't reach for `client:load` here unless a component
genuinely must be interactive before the user can scroll to it (nothing on this page currently
needs that).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
