import { beforeEach, describe, expect, it, vi } from 'vitest';

// An in-memory blob store that honours the conditional writes incrementViews
// relies on, using the stored value as its ETag.
const blobs = new Map<string, string>();

vi.mock('@netlify/blobs', () => ({
	getStore: () => ({
		getWithMetadata: async (key: string) => (blobs.has(key) ? { data: blobs.get(key), etag: blobs.get(key) } : null),
		set: async (key: string, value: string, options: { onlyIfMatch?: string; onlyIfNew?: boolean } = {}) => {
			if (options.onlyIfNew && blobs.has(key)) return { modified: false };
			if (options.onlyIfMatch !== undefined && blobs.get(key) !== options.onlyIfMatch) return { modified: false };

			blobs.set(key, value);

			return { modified: true };
		},
	}),
}));

vi.mock('astro:content', () => ({
	getCollection: async (name: string) => (name === 'thought' ? [{ id: 'consistency' }] : [{ id: '2025' }]),
}));

const { POST } = await import('../../src/pages/api/views/[key]');

// The endpoint only reads params, so a partial context is enough.
const post = (key?: string) => POST({ params: { key } } as unknown as Parameters<typeof POST>[0]) as Promise<Response>;

beforeEach(() => blobs.clear());

describe('POST /api/views/:key', () => {
	it('increments the count for a real page without revealing it', async () => {
		const response = await post('thoughts:consistency');

		expect(response.status).toBe(204);
		expect(await response.text()).toBe('');

		await post('thoughts:consistency');

		expect(blobs.get('thoughts:consistency')).toBe('2');
	});

	it('rejects malformed keys', async () => {
		for (const key of ['junk', '../views', 'x'.repeat(5000), undefined]) {
			expect((await post(key)).status).toBe(400);
		}

		expect(blobs.size).toBe(0);
	});

	it('refuses to write keys for pages that do not exist', async () => {
		for (const key of ['thoughts:made-up', 'reviews:1999', 'site:consistency']) {
			expect((await post(key)).status).toBe(404);
		}

		expect(blobs.size).toBe(0);
	});

	it('recovers from a corrupt stored value', async () => {
		blobs.set('site:home', 'not-a-number');

		await post('site:home');

		expect(blobs.get('site:home')).toBe('1');
	});
});
