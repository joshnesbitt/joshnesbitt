import { defineCollection, z } from 'astro:content';

function transformDate(val) {
	return new Date(val);
}

const thought = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		published: z.boolean().default(true),
		pubDate: z
			.string()
			.or(z.date())
			.transform(transformDate),
		ogImage: z.string().optional(),
	}),
});

export const collections = { thought };
