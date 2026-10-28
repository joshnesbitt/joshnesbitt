import { getCollection } from 'astro:content';

type PostCollection = 'thought' | 'review';

// Published posts in a collection, newest first. Everything that lists or
// builds posts goes through here, so `published: false` hides a post everywhere.
async function getPosts(collection: PostCollection, limit?: number) {
	const posts = await getCollection(collection, ({ data }) => data.published);

	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()).slice(0, limit);
}

export { getPosts };
