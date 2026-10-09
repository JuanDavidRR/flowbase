// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://flowbase-psi.vercel.app',

  // No SSR adapter: the site is pure static again. The HubSpot lead endpoint
  // lives at /api/hubspot-lead.js (repo root), which Vercel deploys as its
  // own standalone serverless function independent of Astro's build - see
  // that file for why.

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});