export const prerender = false;

import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';

// Counts are write-only from the outside: the response never includes them,
// so they're only ever read on the server.
export const POST: APIRoute = async ({ params }) => {
  const key = params.key;

  if (!key) {
    return new Response(null, { status: 400 });
  }

  try {
    const store = getStore({ name: 'views', consistency: 'strong' });
    const current = await store.get(key) || '0';
    const newCount = parseInt(current, 10) + 1;

    await store.set(key, newCount.toString());
  } catch (error) {
    console.error('Blobs POST error:', error);
  }

  return new Response(null, { status: 204 });
};
