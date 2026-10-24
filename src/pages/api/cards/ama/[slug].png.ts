export const prerender = true;

import type { APIRoute } from 'astro';
import { colors, renderPng, truncate } from '../../../../utils/cards';
import { getAnswers } from '../../../../utils/finders';
import { excerpt } from '../../../../utils/excerpt';

// 4:5 portrait, the largest image LinkedIn, Instagram and Bluesky show
// uncropped in the feed.
const WIDTH = 1080;
const HEIGHT = 1350;

function questionSize(question: string) {
  if (question.length > 160) return 52;
  if (question.length > 90) return 64;
  return 80;
}

function generateMarkup(question: string, answer: string, url: string) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
        backgroundColor: colors.background,
        color: colors.text,
        padding: '80px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginBottom: 48,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: colors.accent,
                    marginRight: 16,
                  },
                },
              },
              { type: 'span', props: { style: { opacity: 0.6 }, children: 'Ask me anything' } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: questionSize(question),
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 48,
            },
            children: truncate(question, 220),
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: 1,
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.45,
              opacity: 0.8,
            },
            children: answer,
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
                  style: { display: 'flex', fontSize: 36, fontWeight: 700 },
                  children: [
                    { type: 'span', props: { children: 'Josh Nesbitt' } },
                    { type: 'span', props: { style: { color: colors.accent }, children: '.' } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', fontSize: 26, opacity: 0.6 },
                  children: url,
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
  const answers = await getAnswers();

  return answers.map((answer) => ({
    params: { slug: answer.id },
    props: answer,
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const answer = props as Awaited<ReturnType<typeof getAnswers>>[number];
  const length = answer.data.question.length > 90 ? 260 : 380;

  const markup = generateMarkup(
    answer.data.question,
    excerpt(answer.body, length),
    'joshnesbitt.dev/ama',
  );

  const pngBuffer = await renderPng(markup, WIDTH, HEIGHT);

  return new Response(pngBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
