import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: 'https://joshnesbitt.dev',
  output: 'server',
  integrations: [
    tailwind(),
    sitemap({
      // Server-rendered routes aren't discovered automatically
      customPages: [
        'https://joshnesbitt.dev/',
        'https://joshnesbitt.dev/thoughts/',
        'https://joshnesbitt.dev/reviews/',
        'https://joshnesbitt.dev/speaking/',
      ],
    }),
  ],
  adapter: netlify(),
  build: {
    inlineStylesheets: "auto",
  }
});
