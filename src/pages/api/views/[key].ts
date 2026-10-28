export const prerender = false;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isViewKey, trackableKeys, incrementViews } from '../../../utils/views';

async function isTrackable(key: string): Promise<boolean> {
	const [thoughts, reviews] = await Promise.all([getCollection('thought'), getCollection('review')]);

	return trackableKeys({
		thoughts: thoughts.map((thought) => thought.id),
		reviews: reviews.map((review) => review.id),
	}).has(key);
}

// Counts are write-only from the outside: no response includes them, so
// they're only ever read on the server.
export const POST: APIRoute = async ({ params }) => {
	if (!isViewKey(params.key)) return new Response(null, { status: 400 });
	if (!(await isTrackable(params.key))) return new Response(null, { status: 404 });

	try {
		await incrementViews(params.key);

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Blobs POST error:', error);

		return new Response(null, { status: 503 });
	}
};
