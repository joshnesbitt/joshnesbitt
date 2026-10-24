import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";
import { execSync } from 'node:child_process';

// Netlify sets COMMIT_REF at build time; fall back to git for local builds.
function commitRef() {
  if (process.env.COMMIT_REF) return process.env.COMMIT_REF;

  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return '';
  }
}

const build = {
  commit: commitRef(),
  builtAt: new Date().toISOString(),
};

export default defineConfig({
  site: 'https://joshnesbitt.dev',
  output: 'server',
  integrations: [
    mdx(),
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
  },
  vite: {
    define: {
      __BUILD__: JSON.stringify(build),
    },
  },
});
