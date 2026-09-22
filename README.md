# Flowbase (demo)

A fictional SaaS landing page for **Flowbase** — "scheduling + payment collection for
freelancers who bill by the call." Flowbase isn't a real product. This repo exists to be a
realistic, content-rich marketing site to **practice and demonstrate tracking and marketing-automation
implementations** on: Google Tag Manager, GA4, Microsoft Clarity, and workflow tools like n8n.

## Purpose

This is a playground/portfolio project for frontend + GTM engineering work. The page is built
like a real product launch (hero, social proof, features, pricing, forms, footer signup) so
that it has the same instrumentation surface a real client site would: multiple CTAs, an
expandable FAQ, a pricing toggle, a multi-step narrative with autoplay, and two lead-gen forms.
The goal is to practice wiring these interactions up to:

- **Google Tag Manager / GA4** — container setup, triggers, tags, and event/parameter mapping.
- **Microsoft Clarity** — session recordings and heatmaps layered on top of the same interactions.
- **n8n (or similar)** — turning form submissions into real automations (Slack/email notification,
  CRM row, sequenced follow-up), using the forms' placeholder submit handlers as the hook point.

Because of that, every interactive element on the page was built to be **easy to track first**,
polished second. See [Tracking & instrumentation](#tracking--instrumentation) below for exactly
what's already wired up and where to plug a real container in.

## Stack

- **[Astro](https://astro.build)** (v7) — static site generation, islands architecture.
- **[Tailwind CSS](https://tailwindcss.com)** (v4, via `@tailwindcss/vite`) — styling.
- **[shadcn/ui](https://ui.shadcn.com)** adapted for Astro, on **[Base UI](https://base-ui.com)**
  primitives (not Radix) — accordion, tabs, toggle group, select, card, button, etc.
- **React** — only for the interactive islands (see below); everything else is zero-JS static
  Astro markup.
- **[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)** — sitemap
  generation.

### Islands architecture, and why hydration is lazy

Only five components ship any client-side JavaScript, and all of them hydrate on
`client:visible` (not `client:load`) — nothing executes until the visitor actually scrolls near
it:

| Island | Where | What it does |
| --- | --- | --- |
| `FeaturesAccordion` | FAQ section | Expand/collapse FAQ items |
| `HowItWorksTabs` | "How it works" | Auto-advancing (pausable) step tabs with a live mock preview card |
| `BillingToggle` | Pricing | Monthly/annual price switch |
| `DemoRequestForm` | Demo request | Validated lead form |
| `NewsletterSignup` | Footer | Validated email signup |

Everything else — hero, logos, pricing cards, footer nav, JSON-LD, meta tags — is plain
server-rendered Astro with no client JS at all.

## Tracking & instrumentation

There's no real GTM/GA4/Clarity container wired in yet — that's the point, this is where you
plug yours in. What's already built:

**A global `dataLayer` + one delegated click listener** (`src/layouts/Layout.astro`): any element
on the page with a `data-event="..."` attribute automatically pushes `{ event, ...params }` to
`window.dataLayer` on click — no per-component tracking code needed. Params are read from an
explicit allowlist (`TRACKED_PARAM_KEYS`) so component-internal `data-*` attributes (from
shadcn/Base UI) never leak into the payload.

Events already firing:

| Event | Trigger | Params |
| --- | --- | --- |
| `cta_click` | Any hero/header CTA button | `ctaType` (`primary`/`secondary`/`header`) |
| `feature_expand` | Opening/closing an FAQ item | `featureName` |
| `select_plan` | Clicking "Select plan" | `planName` |
| `toggle_billing` | Switching monthly/annual | `billingPeriod` |
| `journey_step_view` | Selecting a "How it works" step | `stepId` |
| `journey_autoplay_toggle` | Pausing/resuming the step autoplay | `autoplayState` |
| `form_start` | First focus on the demo request form | `form_name` |
| `form_submit` | Successful demo request submit | `form_name`, `company_size` |
| `newsletter_start` | First focus on the newsletter field | — |
| `newsletter_signup` | Successful newsletter submit | — |

Form/email values are intentionally never pushed to `dataLayer` (no PII in the data layer — a
GTM/GA4 best practice worth keeping even in a demo).

**To add a real GTM container:** drop the container snippet in `src/layouts/Layout.astro`
(`<head>` for the script, right after `<body>` for the noscript iframe) — `window.dataLayer` is
already initialized before it, so GTM will pick up any events pushed before it loads.

**To add Microsoft Clarity:** same spot, its own project snippet — it works independently of
`dataLayer`.

**To wire up n8n:** `DemoRequestForm.tsx` and `NewsletterSignup.tsx` both have a placeholder
`handleSubmit`/submit handler with a `// TODO` marking exactly where a real submission would go —
point that `fetch()` at an n8n webhook URL to turn either form into a real automation (Slack
ping, CRM row, email sequence, whatever the workflow needs).

## Getting started

```sh
npm install
npm run dev        # http://localhost:4321
```

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro check` | Type-check `.astro`/`.tsx` files |

See `CLAUDE.md` for more on the codebase's architecture and conventions.

## Not real

Flowbase, its team, its logos, its pricing, and its contact details are all fictional. Nothing on
this site collects real data — the forms have no backend, and no tracking container is currently
installed.
