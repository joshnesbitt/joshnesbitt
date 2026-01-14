import { getCollection } from 'astro:content';
import getReadingTime from 'reading-time';

async function getThoughts() {
	const collection = await getCollection('thought')

	return collection
		.filter((rec) => rec.data.published)
		.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate))
		.map((thought) => ({
			...thought,
			readingTime: getReadingTime(thought.body)
		}));
}

export {
	getThoughts
}
