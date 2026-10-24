import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

function transformDate(val) {
	return new Date(val);
}

const schema = z.object({
	title: z.string(),
	description: z.string(),
	published: z.boolean().default(true),
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

// Each answer is one file: the question in the frontmatter, the answer as the
// body. Files starting with an underscore are skipped, so _template.md stays out.
const ama = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/ama' }),
	schema: z.object({
		question: z.string(),
		asker: z.string().optional(),
		published: z.boolean().default(true),
		pubDate: z
			.string()
			.or(z.date())
			.transform(transformDate)
	}),
});

export const collections = {
	thought,
	review,
	ama
};
