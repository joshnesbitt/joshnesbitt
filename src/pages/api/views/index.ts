export const prerender = false;

import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json'
};

export const GET: APIRoute = async () => {
  try {
    const store = getStore({ name: 'views', consistency: 'strong' });
    const { blobs } = await store.list();

    const views: Record<string, number> = {};

    for (const blob of blobs) {
      const value = await store.get(blob.key) || '0';
      views[blob.key] = parseInt(value, 10);
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
