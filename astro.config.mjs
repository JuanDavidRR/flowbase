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
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});