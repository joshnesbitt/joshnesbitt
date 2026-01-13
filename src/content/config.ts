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
			.transform(transformDate)
	}),
});

const review = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		published: z.boolean().default(true),
		pubDate: z
			.string()
			.or(z.date())
			.transform(transformDate)
	}),
});

export const collections = {
	thought,
	review
};
