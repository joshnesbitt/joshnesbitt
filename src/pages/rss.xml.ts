export const prerender = true;

import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getThoughts, getReviews, getAnswers } from '../utils/finders';
import { excerpt } from '../utils/excerpt';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export const GET: APIRoute = async (context) => {
	const thoughts = await getThoughts();
	const reviews = await getReviews();
	const answers = await getAnswers();

	const items = [
		...thoughts.map((thought) => ({
			title: thought.data.title,
			description: thought.data.description,
			pubDate: thought.data.pubDate,
			link: `/thoughts/${thought.id}/`,
			categories: ['thoughts'],
		})),
		...reviews.map((review) => ({
			title: review.data.title,
			description: review.data.description,
			pubDate: review.data.pubDate,
			link: `/reviews/${review.id}/`,
			categories: ['reviews'],
		})),
		...answers.map((answer) => ({
			title: answer.data.question,
			description: excerpt(answer.body),
			pubDate: answer.data.pubDate,
			link: `/ama/${answer.id}/`,
			categories: ['ama'],
		})),
	].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site!,
		items,
	});
};
