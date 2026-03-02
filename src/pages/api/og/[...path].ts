export const prerender = false;

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
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      url: 'joshnesbitt.dev',
    };
  }

  // Thoughts list page
  if (basePath === 'thoughts') {
    return {
      title: 'Thoughts',
      description: 'A running log of ideas on software engineering, leadership, AI, running conferences and building teams and products that solve human problems.',
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

interface TitleParts {
  prefix: string;
  lastWord: string;
  highlight: string;
}

function formatTitle(title: string): TitleParts {
  const highlightChars = ['?', '!'];
  const lastChar = title.slice(-1);

  let cleanTitle = title;
  let highlight = '.';

  if (highlightChars.includes(lastChar)) {
    cleanTitle = title.slice(0, -1);
    highlight = lastChar;
  }

  const words = cleanTitle.split(' ');
  const lastWord = words.pop() || '';
  const prefix = words.join(' ');

  return {
    prefix: prefix ? prefix + ' ' : '',
    lastWord,
    highlight,
  };
}

function truncateDescription(description: string, maxLength: number = 210): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + '...';
}

function generateSvgMarkup(data: PageData) {
  const { prefix, lastWord, highlight } = formatTitle(data.title);
  const truncatedDescription = truncateDescription(data.description);

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
                    flexWrap: 'wrap',
                    fontSize: 72,
                    fontWeight: 700,
                    color: colors.text,
                    lineHeight: 1.1,
                    marginBottom: 24,
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        children: prefix,
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          display: 'flex',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              children: lastWord,
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                color: colors.accent,
                              },
                              children: highlight,
                            },
                          },
                        ],
                      },
                    },
                  ],
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
              fontSize: 24,
              fontWeight: 400,
              color: colors.text,
              opacity: 0.6,
            },
            children: data.url,
          },
        },
      ],
    },
  };
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
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Error generating image', { status: 500 });
  }
};
