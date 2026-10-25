export const prerender = false;

import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { parseCount } from '../../../utils/views';

const headers = {
  'Content-Type': 'application/json'
};

export const GET: APIRoute = async () => {
  try {
    const store = getStore({ name: 'views', consistency: 'strong' });
    const { blobs } = await store.list();

    const views: Record<string, number> = {};

    for (const blob of blobs) {
      views[blob.key] = parseCount(await store.get(blob.key));
    }

    return new Response(JSON.stringify({ views }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Blobs list error:', error);

    return new Response(JSON.stringify({ views: {}, error: 'Store unavailable' }), {
      status: 200,
      headers
    });
  }
};
