// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://flowbase-psi.vercel.app',

  // Needed so the HubSpot lead endpoint (src/pages/api/hubspot-lead.ts) can run
  // server-side and keep HUBSPOT_SERVICE_KEY out of the client bundle. The rest
  // of the site still prerenders to static HTML.
  //
  // imageService: true offloads image optimization to Vercel's own Image
  // Optimization API instead of bundling the `sharp` native module into the
  // serverless function. sharp@0.35.x has a known packaging bug on Vercel
  // (missing linux-x64 libvips binary) that crashes the whole function with
  // FUNCTION_INVOCATION_FAILED on every request, not just image requests -
  // since all routes share one function, that took down /api/hubspot-lead too.
  adapter: vercel({ imageService: true }),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});