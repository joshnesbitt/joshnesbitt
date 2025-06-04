import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify/functions";

export default defineConfig({
  site: 'https://joshnesbitt.dev',
  output: 'server',
  integrations: [tailwind()],
  adapter: netlify(),
  build: {
    inlineStylesheets: "auto",
  }
});
