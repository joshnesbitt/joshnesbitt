// Posts to Bluesky with a link card for the article.
//
// Needs BLUESKY_HANDLE and BLUESKY_APP_PASSWORD (an app password from
// Settings > Privacy and security > App passwords, never the account one).

import { AtpAgent, RichText } from '@atproto/api';

// Bluesky rejects blobs over 1MB.
const MAX_THUMB_BYTES = 976_560;

async function uploadThumb(agent, url) {
	const response = await fetch(url);
	if (!response.ok) return undefined;

	const bytes = new Uint8Array(await response.arrayBuffer());
	if (bytes.byteLength > MAX_THUMB_BYTES) return undefined;

	const { data } = await agent.uploadBlob(bytes, { encoding: response.headers.get('content-type') ?? 'image/png' });
	return data.blob;
}

export async function postToBluesky(post, text) {
	const agent = new AtpAgent({ service: process.env.BLUESKY_SERVICE ?? 'https://bsky.social' });
	await agent.login({
		identifier: process.env.BLUESKY_HANDLE,
		password: process.env.BLUESKY_APP_PASSWORD,
	});

	const rich = new RichText({ text });
	await rich.detectFacets(agent);

	const { uri } = await agent.post({
		text: rich.text,
		facets: rich.facets,
		langs: ['en-GB'],
		createdAt: new Date().toISOString(),
		embed: {
			$type: 'app.bsky.embed.external',
			external: {
				uri: post.url,
				title: post.title,
				description: post.description,
				thumb: await uploadThumb(agent, post.image),
			},
		},
	});

	// at://did/app.bsky.feed.post/rkey -> the web URL
	const [, , did, , rkey] = uri.split('/');
	return `https://bsky.app/profile/${did}/post/${rkey}`;
}
