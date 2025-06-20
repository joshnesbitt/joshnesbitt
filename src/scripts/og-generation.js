const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Load posts from the Astro content collection output
const thoughts = require('../../.astro/content/thought.json'); // Adjust if needed

const ogImagesDir = path.join(__dirname, '../../public/og-images');
if (!fs.existsSync(ogImagesDir)) {
  fs.mkdirSync(ogImagesDir, { recursive: true });
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const thought of thoughts) {
    const slug = thought.slug || thought.id;
    const title = encodeURIComponent(thought.title || thought.data.title);
    const url = `http://localhost:4321/open-graph?title=${title}`;
    await page.goto(url);
    await page.setViewport({ width: 1200, height: 630 });
    const outPath = path.join(ogImagesDir, `${slug}.png`);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`Generated OG image for: ${slug}`);
  }

  await browser.close();
})(); 