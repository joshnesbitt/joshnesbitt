import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// pubDate is ISO 8601 with a timezone, e.g. 2019-01-09T10:00:00Z, so posts
// date the same wherever the site is built.
const schema = z.object({
	title: z.string(),
	description: z.string(),
	published: z.boolean().default(true),
	pubDate: z.coerce.date()
});

const thought = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/thought' }),
	schema,
});

const review = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/review' }),
	schema,
});

export const collections = {
	thought,
	review
};
