import { getCollection } from 'astro:content';

async function getThoughts() {
	const collection = await getCollection('thought')

	return collection.sort(
	  (a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate)
	);
}

export {
	getThoughts
}
