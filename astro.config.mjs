import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: 'https://joshnesbitt.dev',
  // Pages are built ahead of time. Routes that need a server (the view
  // counts API) opt out with `export const prerender = false`.
  integrations: [
    mdx(),
    sitemap(),
  ],
  adapter: netlify(),
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    optimizeDeps: {
      // The view transitions client is only discovered once a page loads in
      // the browser, so Vite re-optimises and reloads mid-session. Bundle it
      // up front so the dev server (and the a11y check against it) is stable.
      include: [
        'astro/virtual-modules/transitions-events.js',
        'astro/virtual-modules/transitions-router.js',
        'astro/virtual-modules/transitions-swap-functions.js',
        'astro/virtual-modules/transitions-types.js',
      ],
    },
  },
});
