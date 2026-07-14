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

async function getRelatedThoughts(current, limit = 3) {
	const collection = await getCollection('thought')

	const sharedTags = (rec) =>
		rec.data.tags.filter((tag) => current.data.tags.includes(tag)).length;

	return collection
		.filter((rec) => rec.data.published && rec.id !== current.id)
		.sort((a, b) =>
			sharedTags(b) - sharedTags(a) ||
			new Date(b.data.pubDate) - new Date(a.data.pubDate)
		)
		.slice(0, limit);
}

export {
	getThoughts,
	getReviews,
	getRelatedThoughts
}
