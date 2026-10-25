import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

function transformDate(val) {
	return new Date(val);
}

const schema = z.object({
	title: z.string(),
	description: z.string(),
	published: z.boolean().default(true),
	// Cross-posting to LinkedIn and Bluesky (see scripts/syndicate.mjs)
	syndicate: z.boolean().default(true),
	social: z
		.object({
			linkedin: z.string().optional(),
			bluesky: z.string().optional(),
		})
		.optional(),
	pubDate: z
		.string()
		.or(z.date())
		.transform(transformDate)
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
