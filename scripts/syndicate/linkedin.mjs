// Posts to LinkedIn through the Posts API with an article card.
//
// Needs LINKEDIN_ACCESS_TOKEN (a member token with the w_member_social scope)
// and LINKEDIN_AUTHOR_URN (urn:li:person:...). Member tokens last 60 days, so
// a 401 here almost always means the token needs renewing.

const API = 'https://api.linkedin.com/rest';

function headers(extra = {}) {
	return {
		Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
		'LinkedIn-Version': process.env.LINKEDIN_VERSION || '202606',
		'X-Restli-Protocol-Version': '2.0.0',
		...extra,
	};
}

async function check(response, action) {
	if (response.ok) return response;

	const detail = await response.text();
	const hint = response.status === 401 ? ' The access token has probably expired; generate a new one and update LINKEDIN_ACCESS_TOKEN.' : '';
	throw new Error(`LinkedIn ${action} failed with ${response.status}: ${detail}${hint}`);
}

// Commentary is "little text": these characters are markup unless escaped,
// and an unescaped one can silently truncate the post.
export function escapeCommentary(text) {
	return text.replace(/[\\|{}@[\]()<>#*_~]/g, (char) => `\\${char}`)
		// Hashtags are the one piece of markup we want LinkedIn to render.
		.replace(/\\#(\w+)/g, '{hashtag|\\#|$1}');
}

async function uploadThumb(url, owner) {
	const image = await fetch(url);
	if (!image.ok) return undefined;

	const init = await check(await fetch(`${API}/images?action=initializeUpload`, {
		method: 'POST',
		headers: headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({ initializeUploadRequest: { owner } }),
	}), 'image upload');
	const { value } = await init.json();

	await check(await fetch(value.uploadUrl, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}` },
		body: Buffer.from(await image.arrayBuffer()),
	}), 'image upload');

	return value.image;
}

export async function postToLinkedIn(post, text) {
	const author = process.env.LINKEDIN_AUTHOR_URN;

	const response = await check(await fetch(`${API}/posts`, {
		method: 'POST',
		headers: headers({ 'Content-Type': 'application/json' }),
		body: JSON.stringify({
			author,
			commentary: escapeCommentary(text),
			visibility: 'PUBLIC',
			distribution: {
				feedDistribution: 'MAIN_FEED',
				targetEntities: [],
				thirdPartyDistributionChannels: [],
			},
			content: {
				article: {
					source: post.url,
					title: post.title,
					description: post.description,
					thumbnail: await uploadThumb(post.image, author),
				},
			},
			lifecycleState: 'PUBLISHED',
			isReshareDisabledByAuthor: false,
		}),
	}), 'post');

	const id = response.headers.get('x-restli-id');
	return id ? `https://www.linkedin.com/feed/update/${id}/` : 'https://www.linkedin.com/in/me/recent-activity/all/';
}
