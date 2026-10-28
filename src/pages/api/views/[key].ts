export const prerender = false;

import type { APIRoute } from 'astro';
import { isViewKey, incrementViews } from '../../../utils/views';

// Counts are write-only from the outside: no response includes them, so
// they're only ever read on the server.
export const POST: APIRoute = async ({ params }) => {
	if (!isViewKey(params.key)) return new Response(null, { status: 400 });

	try {
		await incrementViews(params.key);

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Blobs POST error:', error);

		return new Response(null, { status: 503 });
	}
};
