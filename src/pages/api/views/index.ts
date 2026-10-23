export const prerender = false;

import type { APIRoute } from 'astro';
import { json, getAllViews } from '../../../utils/views';

export const GET: APIRoute = async () => {
	try {
		return json({ views: await getAllViews() });
	} catch (error) {
		console.error('Blobs list error:', error);

		return json({ error: 'Store unavailable' }, 503);
	}
};
