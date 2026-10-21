import { getCollection } from 'astro:content';

async function getThoughts(limit) {
	const collection = await getCollection('thought')

	return collection
		.filter((rec) => rec.data.published)
		.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate))
		.slice(0, limit);
}

async function getReviews(limit) {
	const collection = await getCollection('review')

	return collection
		.filter((rec) => rec.data.published)
		.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate))
		.slice(0, limit);
}

// Picks the one thought to read next. Rarer shared tags count for more, so a
// shared "teams" outweighs a shared "events"; ties go to the post written
// closest in time. Returns undefined when nothing shares a tag.
async function getNextThought(current) {
	const collection = (await getCollection('thought'))
		.filter((rec) => rec.data.published);

	const tagCounts = {};
	collection.flatMap((rec) => rec.data.tags).forEach((tag) => {
		tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
	});

	const score = (rec) => rec.data.tags
		.filter((tag) => current.data.tags.includes(tag))
		.reduce((sum, tag) => sum + Math.log(collection.length / tagCounts[tag]), 0);

	const distance = (rec) =>
		Math.abs(new Date(rec.data.pubDate) - new Date(current.data.pubDate));

	return collection
		.filter((rec) => rec.id !== current.id && score(rec) > 0)
		.sort((a, b) => score(b) - score(a) || distance(a) - distance(b))[0];
}

export {
	getThoughts,
	getReviews,
	getNextThought
}
