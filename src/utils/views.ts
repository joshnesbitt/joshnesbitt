import { getStore, type Store } from '@netlify/blobs';

// View counts live in Netlify Blobs, one entry per `namespace:slug` key
// (see TrackView.astro).
const KEY_PATTERN = /^(site|thoughts|reviews):[a-z0-9-]{1,100}$/;
const MAX_ATTEMPTS = 10;

function viewsStore() {
	return getStore({ name: 'views', consistency: 'strong' });
}

function isViewKey(key: string | undefined): key is string {
	return !!key && KEY_PATTERN.test(key);
}

// The most viewed posts, ties going to the newer post. Counts are read here
// on the server and only used for ordering, so they never reach the client.
// Returns nothing when the store is unavailable or fewer than `minimum` posts
// have been read, so callers can simply not render.
async function getMostViewed<T extends { id: string; data: { pubDate: Date } }>(
	namespace: string,
	posts: T[],
	{ limit = 5, minimum = 3 } = {}
): Promise<T[]> {
	try {
		const store = viewsStore();
		const counts = await Promise.all(
			posts.map(async (post) => parseInt((await store.get(`${namespace}:${post.id}`, { type: 'text' })) || '0', 10))
		);

		const ranked = posts
			.map((post, index) => ({ post, views: counts[index] }))
			.filter(({ views }) => views > 0)
			.sort((a, b) => b.views - a.views || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
			.slice(0, limit);

		return ranked.length >= minimum ? ranked.map(({ post }) => post) : [];
	} catch {
		return [];
	}
}

// Blobs has no atomic increment, so write only if the entry is unchanged
// since we read it, and retry if another request got there first. The local
// dev server doesn't send ETags on reads, so there it falls back to a plain
// write.
async function incrementViews(key: string, store: Pick<Store, 'getWithMetadata' | 'set'> = viewsStore()) {
	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const entry = await store.getWithMetadata(key);

		if (entry && !entry.etag) {
			const next = parseInt(entry.data, 10) + 1;

			await store.set(key, String(next));

			return next;
		}

		const next = entry ? parseInt(entry.data, 10) + 1 : 1;
		const { modified } = entry
			? await store.set(key, String(next), { onlyIfMatch: entry.etag })
			: await store.set(key, String(next), { onlyIfNew: true });

		if (modified) return next;

		// Back off a little, with jitter, so retrying requests spread out.
		await new Promise((resolve) => setTimeout(resolve, Math.random() * 25 * (attempt + 1)));
	}

	throw new Error(`Gave up incrementing ${key} after ${MAX_ATTEMPTS} attempts`);
}

export { isViewKey, getMostViewed, incrementViews };
