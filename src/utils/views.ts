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

export {
	isViewKey,
	incrementViews
}
