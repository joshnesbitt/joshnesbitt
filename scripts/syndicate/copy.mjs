// Writes the LinkedIn and Bluesky copy for a post with Claude, then checks it
// against the house rules and asks again if anything slipped through.

import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { RichText } from '@atproto/api';
import { z } from 'zod';

export const LIMITS = { linkedin: 1300, bluesky: 300 };

const MAX_ATTEMPTS = 3;

const SYSTEM = `You write the social posts that announce Josh Nesbitt's new blog posts. Josh is a UK technology leader: former CTO, AI strategy consultant at Stac Works, founder of the All Day Hey! conference, and host of the Off Script podcast. The posts go out under his name, so they must sound like him: direct, opinionated, grounded in practical experience, never hype.

The link to the article is attached to each post as a preview card, so never include the URL or say "link below" or "link in comments".

LinkedIn
- Up to ${LIMITS.linkedin} characters including hashtags. Aim for 600 to 1,100.
- The first line carries the post. LinkedIn cuts off after roughly 200 characters, so open with the sharpest claim or question from the article, never with "I just wrote" or "New post".
- Short paragraphs separated by blank lines. One idea per paragraph.
- Pull out the one or two points a senior tech or education leader would argue with or act on. Give enough that the post stands on its own, but leave a reason to read the article.
- Close with a plain pointer to the article or a question that invites a considered reply. No engagement bait.
- Two or three relevant hashtags at the very end, or none.

Bluesky
- Hard limit of ${LIMITS.bluesky} characters. Aim for 180 to 260.
- Conversational and compact: one sharp idea in a sentence or two, the way you'd say it to a peer.
- No hashtags.

Rules for both
- UK English spelling, Oxford comma.
- No emoji. No em dashes or en dashes: use full stops, commas, colons, or parentheses.
- No comparative negation ("it's not X, it's Y"). State the positive directly.
- Don't lean on lists of three.
- No throat-clearing or signposting. No "I'll be honest", "honestly", "this means", "in practical terms", "that is why", "here's the thing".
- Never use: delve, deep dive, leverage (as a verb), utilize, optimise, transformative, revolutionary, game-changing, landscape, journey, navigate, ecosystem, unlock, unpack, double down, nuanced, multifaceted, tapestry, "why it matters", "in today's fast-paced world", "it goes without saying", "in conclusion".
- No superlatives or metaphors that the article doesn't earn. Don't invent facts, numbers, or quotes that aren't in the article.`;

const BANNED = [
	'delve', 'deep dive', 'leverage', 'utilize', 'utilise', 'optimise', 'optimize',
	'transformative', 'revolutionary', 'game-changing', 'game changer', 'landscape',
	'journey', 'navigate', 'ecosystem', 'unlock', 'unpack', 'double down', 'nuanced',
	'multifaceted', 'tapestry', 'why it matters', 'honestly', "i'll be honest",
	'in conclusion', 'it goes without saying', 'fast-paced world',
];

const EMOJI = /\p{Extended_Pictographic}/u;

const Copy = z.object({
	linkedin: z.string().describe('The LinkedIn post text'),
	bluesky: z.string().describe('The Bluesky post text'),
});

export function graphemes(text) {
	return new RichText({ text }).graphemeLength;
}

export function problems(platform, text) {
	const found = [];
	const length = platform === 'bluesky' ? graphemes(text) : text.length;

	if (length > LIMITS[platform]) found.push(`is ${length} characters, over the ${LIMITS[platform]} limit`);
	if (/[–—]/.test(text)) found.push('contains an em or en dash');
	if (EMOJI.test(text)) found.push('contains an emoji');
	if (/https?:\/\//.test(text)) found.push('contains a URL');
	if (platform === 'bluesky' && /(^|\s)#\w/.test(text)) found.push('contains a hashtag');

	const lower = text.toLowerCase();
	const banned = BANNED.filter((phrase) => lower.includes(phrase));
	if (banned.length) found.push(`uses banned wording: ${banned.join(', ')}`);

	return found;
}

function article(post) {
	return `<article>
<title>${post.title}</title>
<description>${post.description}</description>
<body>
${post.body}
</body>
</article>

Write the LinkedIn and Bluesky posts for this article.`;
}

export async function writeCopy(post) {
	const client = new Anthropic();
	let prompt = article(post);

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
		const response = await client.beta.messages.parse({
			model: 'claude-opus-5-5',
			max_tokens: 16000,
			betas: ['server-side-fallback-2026-07-01'],
			fallbacks: 'default',
			output_config: { effort: 'high', format: betaZodOutputFormat(Copy) },
			system: SYSTEM,
			messages: [{ role: 'user', content: prompt }],
		});

		if (response.stop_reason === 'refusal') {
			throw new Error(`Claude declined to write copy for ${post.file}: ${response.stop_details?.explanation ?? 'no reason given'}`);
		}

		const copy = response.parsed_output;
		if (!copy) throw new Error(`Claude returned copy for ${post.file} that didn't match the schema`);

		const feedback = ['linkedin', 'bluesky']
			.flatMap((platform) => problems(platform, copy[platform]).map((p) => `The ${platform} post ${p}.`));

		if (feedback.length === 0) return copy;

		console.warn(`Attempt ${attempt} for ${post.file}: ${feedback.join(' ')}`);
		prompt = `${article(post)}

A previous draft broke the rules:

<linkedin>
${copy.linkedin}
</linkedin>

<bluesky>
${copy.bluesky}
</bluesky>

${feedback.join(' ')} Rewrite both posts and fix these.`;
	}

	throw new Error(`Couldn't get copy for ${post.file} within the house rules after ${MAX_ATTEMPTS} attempts`);
}
