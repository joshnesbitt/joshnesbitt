export const prerender = true;

import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../../consts';

const WIDTH = 1200;
const HEIGHT = 630;

// Load fonts
const fontBoldPath = path.join(process.cwd(), 'src/assets/fonts/DMSans-Bold.woff');
const fontRegularPath = path.join(process.cwd(), 'src/assets/fonts/DMSans-Regular.woff');

let fontBold: ArrayBuffer;
let fontRegular: ArrayBuffer;

try {
  fontBold = fs.readFileSync(fontBoldPath);
  fontRegular = fs.readFileSync(fontRegularPath);
} catch (e) {
  console.error('Failed to load fonts:', e);
}

// Colors matching the site
const colors = {
  background: '#FFFFFF',
  text: '#000103',
  accent: '#46FF10',
};

interface PageData {
  title: string;
  description: string;
  url: string;
}

async function getPageData(pathSegments: string[]): Promise<PageData | null> {
  const basePath = pathSegments.join('/').replace(/\.png$/, '');

  // Homepage
  if (!basePath || basePath === 'index') {
    return {
      title: "Hello",
      description: SITE_DESCRIPTION,
      url: 'joshnesbitt.dev',
    };
  }

  // Speaking page
  if (basePath === 'speaking') {
    return {
      title: 'Speaking',
      description: 'Josh speaks, hosts and moderates at technology events — on engineering leadership, AI and building communities.',
      url: 'joshnesbitt.dev/speaking',
    };
  }

  // Thoughts list page
  if (basePath === 'thoughts') {
    return {
      title: 'Thoughts',
      description: 'A running log of thoughts on engineering, leadership, AI, running conferences and building teams, products, platforms and communities.',
      url: 'joshnesbitt.dev/thoughts',
    };
  }

  // Reviews list page
  if (basePath === 'reviews') {
    return {
      title: 'Reviews',
      description: 'Annual reflections on work and life.',
      url: 'joshnesbitt.dev/reviews',
    };
  }

  // Individual thought
  if (basePath.startsWith('thoughts/')) {
    const slug = basePath.replace('thoughts/', '');
    const thoughts = await getCollection('thought');
    const thought = thoughts.find(t => t.slug === slug);

    if (thought) {
      return {
        title: thought.data.title,
        description: thought.data.description,
        url: `joshnesbitt.dev/thoughts/${slug}`,
      };
    }
  }

  // Individual review
  if (basePath.startsWith('reviews/')) {
    const slug = basePath.replace('reviews/', '');
    const reviews = await getCollection('review');
    const review = reviews.find(r => r.slug === slug);

    if (review) {
      return {
        title: review.data.title,
        description: review.data.description,
        url: `joshnesbitt.dev/reviews/${slug}`,
      };
    }
  }

  return null;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

function generateSvgMarkup(data: PageData) {
  const truncatedDescription = truncate(data.description, 210);
  const truncatedUrl = truncate(data.url, 50);

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        padding: '60px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              justifyContent: 'flex-start',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: 72,
                    fontWeight: 700,
                    color: colors.text,
                    lineHeight: 1.1,
                    marginBottom: 24,
                  },
                  children: data.title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 32,
                    fontWeight: 400,
                    color: colors.text,
                    opacity: 0.8,
                    lineHeight: 1.4,
                  },
                  children: truncatedDescription,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: 32,
                    fontWeight: 700,
                    color: colors.text,
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        children: 'Josh Nesbitt',
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          color: colors.accent,
                        },
                        children: '.',
                      },
                    },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    textAlign: 'right',
                    maxWidth: 720,
                    marginLeft: 40,
                    fontSize: 24,
                    fontWeight: 400,
                    color: colors.text,
                    opacity: 0.6,
                  },
                  children: truncatedUrl,
                },
              },
            ],
          },
        },
      ],
    },
  };
}

export async function getStaticPaths() {
  const thoughts = await getCollection('thought');
  const reviews = await getCollection('review');

  return [
    { params: { path: 'index.png' } },
    { params: { path: 'speaking.png' } },
    { params: { path: 'thoughts.png' } },
    { params: { path: 'reviews.png' } },
    ...thoughts.map((thought) => ({ params: { path: `thoughts/${thought.slug}.png` } })),
    ...reviews.map((review) => ({ params: { path: `reviews/${review.slug}.png` } })),
  ];
}

export const GET: APIRoute = async ({ params }) => {
  const pathParam = params.path || 'index';
  const pathSegments = Array.isArray(pathParam) ? pathParam : pathParam.split('/');

  try {
    const pageData = await getPageData(pathSegments);

    if (!pageData) {
      return new Response('Not found', { status: 404 });
    }

    const markup = generateSvgMarkup(pageData);

    const svg = await satori(markup, {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: 'DM Sans',
          data: fontBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'DM Sans',
          data: fontRegular,
          weight: 400,
          style: 'normal',
        },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: WIDTH,
      },
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Error generating image', { status: 500 });
  }
};
