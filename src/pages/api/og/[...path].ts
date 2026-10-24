export const prerender = true;

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../../consts';
import { colors, renderPng, truncate } from '../../../utils/cards';
import { getAnswers } from '../../../utils/finders';
import { excerpt } from '../../../utils/excerpt';

const WIDTH = 1200;
const HEIGHT = 630;

interface PageData {
  title: string;
  description: string;
  url: string;
  eyebrow?: string;
}

// Questions run longer than titles, so step the size down to keep them on the card.
function titleSize(title: string) {
  if (title.length > 120) return 48;
  if (title.length > 60) return 60;
  return 72;
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

  // AMA list page
  if (basePath === 'ama') {
    return {
      title: 'Ask me anything',
      description: 'Questions on engineering leadership, AI, running conferences and building teams, answered in public.',
      url: 'joshnesbitt.dev/ama',
    };
  }

  // Individual AMA answer
  if (basePath.startsWith('ama/')) {
    const slug = basePath.replace('ama/', '');
    const answers = await getAnswers();
    const answer = answers.find(a => a.id === slug);

    if (answer) {
      return {
        eyebrow: 'Ask me anything',
        title: answer.data.question,
        description: excerpt(answer.body, 210),
        url: `joshnesbitt.dev/ama/${slug}`,
      };
    }
  }

  // Individual thought
  if (basePath.startsWith('thoughts/')) {
    const slug = basePath.replace('thoughts/', '');
    const thoughts = await getCollection('thought');
    const thought = thoughts.find(t => t.id === slug);

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
    const review = reviews.find(r => r.id === slug);

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
        boxSizing: 'border-box',
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
              ...(data.eyebrow ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: colors.text,
                    opacity: 0.6,
                    marginBottom: 20,
                  },
                  children: data.eyebrow,
                },
              }] : []),
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: titleSize(data.title),
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
  const answers = await getAnswers();

  return [
    { params: { path: 'index.png' } },
    { params: { path: 'speaking.png' } },
    { params: { path: 'thoughts.png' } },
    { params: { path: 'reviews.png' } },
    { params: { path: 'ama.png' } },
    ...thoughts.map((thought) => ({ params: { path: `thoughts/${thought.id}.png` } })),
    ...reviews.map((review) => ({ params: { path: `reviews/${review.id}.png` } })),
    ...answers.map((answer) => ({ params: { path: `ama/${answer.id}.png` } })),
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

    const pngBuffer = await renderPng(markup, WIDTH, HEIGHT);

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
