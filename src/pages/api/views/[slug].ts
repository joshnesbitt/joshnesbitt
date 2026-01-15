export const prerender = false;

import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';

function isNetlifyEnvironment() {
  return !!(process.env.NETLIFY || process.env.NETLIFY_LOCAL);
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!isNetlifyEnvironment()) {
    return new Response(JSON.stringify({ views: 0, local: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const store = getStore('views');
  const views = await store.get(slug) || '0';

  return new Response(JSON.stringify({ views: parseInt(views, 10) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!isNetlifyEnvironment()) {
    return new Response(JSON.stringify({ views: 1, local: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const store = getStore('views');
  const current = await store.get(slug) || '0';
  const newCount = parseInt(current, 10) + 1;

  await store.set(slug, newCount.toString());

  return new Response(JSON.stringify({ views: newCount }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
