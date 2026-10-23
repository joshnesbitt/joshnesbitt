export const prerender = false;

import type { APIRoute } from 'astro';
import { isViewKey, json, getViews, incrementViews } from '../../../utils/views';

export const GET: APIRoute = async ({ params }) => {
	if (!isViewKey(params.key)) return json({ error: 'Unknown key' }, 400);

	try {
		return json({ views: await getViews(params.key) });
	} catch (error) {
		console.error('Blobs GET error:', error);

		return json({ error: 'Store unavailable' }, 503);
	}
};

export const POST: APIRoute = async ({ params }) => {
	if (!isViewKey(params.key)) return json({ error: 'Unknown key' }, 400);

	try {
		return json({ views: await incrementViews(params.key) });
	} catch (error) {
		console.error('Blobs POST error:', error);

		return json({ error: 'Store unavailable' }, 503);
	}
};
