export const prerender = false;

import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';
import { getCollection } from 'astro:content';
import { trackableKeys, parseCount } from '../../../utils/views';

const headers = {
  'Content-Type': 'application/json'
};

async function isTrackable(key: string | undefined): Promise<boolean> {
  if (!key) return false;

  const thoughts = await getCollection('thought');
  const reviews = await getCollection('review');

  return trackableKeys({
    thoughts: thoughts.map((thought) => thought.id),
    reviews: reviews.map((review) => review.id),
  }).has(key);
}

function notFound() {
  return new Response(JSON.stringify({ error: 'Unknown key' }), {
    status: 404,
    headers
  });
}

export const GET: APIRoute = async ({ params }) => {
  const key = params.key;

  if (!(await isTrackable(key))) return notFound();

  try {
    const store = getStore({ name: 'views', consistency: 'strong' });
    const views = parseCount(await store.get(key!));

    return new Response(JSON.stringify({ views }), {
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
  const key = params.key;

  if (!(await isTrackable(key))) return notFound();

  try {
    const store = getStore({ name: 'views', consistency: 'strong' });
    const newCount = parseCount(await store.get(key!)) + 1;

    await store.set(key!, newCount.toString());

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
