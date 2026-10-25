// Checks the built site in dist/. Run `npm run build` first.

import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const site = 'https://joshnesbitt.dev';

// Pages rendered on demand, so absent from dist/.
const serverRoutes = new Set(['/', '/thoughts', '/reviews']);

// Served by Netlify rather than the build.
const netlifyPaths = /^\/\.netlify\//;

if (!fs.existsSync(dist)) {
  throw new Error('dist/ not found. Run `npm run build` before the build tests.');
}

function entries(collection: string) {
  const dir = path.resolve('src/content', collection);

  return fs.readdirSync(dir).filter((file) => /\.mdx?$/.test(file)).map((file) => ({
    id: file.replace(/\.mdx?$/, ''),
    published: !/^published:\s*false\s*$/m.test(fs.readFileSync(path.join(dir, file), 'utf8')),
  }));
}

function htmlFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function existsInDist(pathname: string) {
  const file = path.join(dist, decodeURIComponent(pathname));

  return fs.existsSync(file) && fs.statSync(file).isFile()
    || fs.existsSync(path.join(file, 'index.html'));
}

const isPng = (file: string) =>
  fs.readFileSync(file).subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));

const content = [
  ...entries('thought').map((entry) => ({ ...entry, route: `thoughts/${entry.id}` })),
  ...entries('review').map((entry) => ({ ...entry, route: `reviews/${entry.id}` })),
];

describe.each(content)('$route', ({ route }) => {
  const html = () => fs.readFileSync(path.join(dist, route, 'index.html'), 'utf8');

  it('renders a page', () => {
    expect(existsInDist(`/${route}`)).toBe(true);
  });

  it('has a valid Open Graph image', () => {
    const png = path.join(dist, 'api/og', `${route}.png`);

    expect(isPng(png)).toBe(true);
    expect(html()).toContain(`content="${site}/api/og/${route}.png"`);
  });

  it('has a canonical URL', () => {
    expect(html()).toContain(`rel="canonical" href="${site}/${route}/"`);
  });
});

describe('Open Graph images for top-level pages', () => {
  it.each(['index', 'speaking', 'thoughts', 'reviews'])('%s.png', (name) => {
    expect(isPng(path.join(dist, 'api/og', `${name}.png`))).toBe(true);
  });
});

describe('RSS feed', () => {
  const feed = fs.readFileSync(path.join(dist, 'rss.xml'), 'utf8');

  it('lists every published post exactly once', () => {
    for (const { route, published } of content) {
      const occurrences = feed.split(`<link>${site}/${route}/</link>`).length - 1;
      expect(occurrences, route).toBe(published ? 1 : 0);
    }
  });

  it('gives every item a valid date', () => {
    const dates = [...feed.matchAll(/<pubDate>(.*?)<\/pubDate>/g)].map((match) => match[1]);

    expect(dates.length).toBe(content.filter((entry) => entry.published).length);
    dates.forEach((date) => expect(Number.isNaN(Date.parse(date)), date).toBe(false));
  });
});

describe('sitemap', () => {
  const sitemap = fs.readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8');

  it.each(['/', '/thoughts/', '/reviews/', '/speaking/', ...content.map(({ route }) => `/${route}/`)])(
    'includes %s',
    (pathname) => expect(sitemap).toContain(`<loc>${site}${pathname}</loc>`),
  );
});

describe('internal links and assets', () => {
  it.each(htmlFiles(dist).map((file) => path.relative(dist, file)))('%s', (file) => {
    const html = fs.readFileSync(path.join(dist, file), 'utf8');
    const urls = [...html.matchAll(/\s(?:href|src|content)="([^"]+)"/g)].map((match) => match[1]);

    const broken = urls
      .filter((url) => url.startsWith('/') && !url.startsWith('//') || url.startsWith(`${site}/`))
      .map((url) => new URL(url, site).pathname.replace(/(.)\/$/, '$1'))
      .filter((pathname) => !serverRoutes.has(pathname) && !netlifyPaths.test(pathname) && !existsInDist(pathname));

    expect(broken).toEqual([]);
  });
});
