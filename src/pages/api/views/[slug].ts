export const prerender = false;

import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';

const headers = {
  'Content-Type': 'application/json'
};

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers
    });
  }

  try {
    const store = getStore({ name: 'views', consistency: 'strong' });
    const views = await store.get(slug) || '0';

    return new Response(JSON.stringify({ views: parseInt(views, 10) }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Blobs GET error:', error);
    return new Response(JSON.stringify({ views: 0, error: 'Store unavailable' }), {
      status: 200,
      headers
    });
  }
};

export const POST: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers
    });
  }

  try {
    const store = getStore({ name: 'views', consistency: 'strong' });
    const current = await store.get(slug) || '0';
    const newCount = parseInt(current, 10) + 1;

    await store.set(slug, newCount.toString());

    return new Response(JSON.stringify({ views: newCount }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Blobs POST error:', error);
    return new Response(JSON.stringify({ views: 1, error: 'Store unavailable' }), {
      status: 200,
      headers
    });
  }
};
