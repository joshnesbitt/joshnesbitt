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
  }
});
