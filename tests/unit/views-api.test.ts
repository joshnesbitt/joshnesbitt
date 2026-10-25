import { beforeEach, describe, expect, it, vi } from 'vitest';

const blobs = new Map<string, string>();

vi.mock('@netlify/blobs', () => ({
  getStore: () => ({
    get: async (key: string) => blobs.get(key) ?? null,
    set: async (key: string, value: string) => void blobs.set(key, value),
    list: async () => ({ blobs: [...blobs.keys()].map((key) => ({ key })) }),
  }),
}));

vi.mock('astro:content', () => ({
  getCollection: async (name: string) =>
    name === 'thought' ? [{ id: 'consistency' }] : [{ id: '2025' }],
}));

const { GET, POST } = await import('../../src/pages/api/views/[key]');
const { GET: LIST } = await import('../../src/pages/api/views/index');

// Endpoints only read params, so a partial context is enough.
const call = (handler: typeof GET, key?: string) =>
  handler({ params: { key } } as unknown as Parameters<typeof GET>[0]) as Promise<Response>;

beforeEach(() => blobs.clear());

describe('POST /api/views/:key', () => {
  it('increments the count for a real page', async () => {
    expect(await (await call(POST, 'thoughts:consistency')).json()).toEqual({ views: 1 });
    expect(await (await call(POST, 'thoughts:consistency')).json()).toEqual({ views: 2 });
    expect(blobs.get('thoughts:consistency')).toBe('2');
  });

  it('refuses to write keys for pages that do not exist', async () => {
    for (const key of ['thoughts:made-up', 'junk', '../views', 'x'.repeat(5000), undefined]) {
      const response = await call(POST, key);
      expect(response.status).toBe(404);
    }

    expect(blobs.size).toBe(0);
  });

  it('recovers from a corrupt stored value', async () => {
    blobs.set('site:home', 'not-a-number');

    expect(await (await call(POST, 'site:home')).json()).toEqual({ views: 1 });
  });
});

describe('GET /api/views/:key', () => {
  it('returns zero for a page with no views yet', async () => {
    const response = await call(GET, 'reviews:2025');

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(await response.json()).toEqual({ views: 0 });
  });

  it('returns 404 for unknown keys', async () => {
    expect((await call(GET, 'reviews:1999')).status).toBe(404);
  });
});

describe('GET /api/views', () => {
  it('lists every stored count as a number', async () => {
    blobs.set('site:home', '3');
    blobs.set('site:speaking', 'garbage');

    const response = await call(LIST);

    expect(await response.json()).toEqual({ views: { 'site:home': 3, 'site:speaking': 0 } });
  });
});
