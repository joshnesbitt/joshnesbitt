// Cross-posts newly published posts to LinkedIn and Bluesky.
//
//   node scripts/syndicate.mjs draft --base <sha> --head <sha> [--out drafts.json]
//   node scripts/syndicate.mjs draft --file src/content/thought/x.md [--out drafts.json]
//   node scripts/syndicate.mjs publish <linkedin|bluesky> [--in drafts.json]
//
// `draft` finds what to post and writes the copy; `publish` waits for the post
// to go live and sends one platform's copy. They're separate so the copy can
// be reviewed in between, and a failed platform can be retried on its own.

import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { changedPosts, loadPost } from './syndicate/posts.mjs';
import { writeCopy, problems } from './syndicate/copy.mjs';
import { postToLinkedIn } from './syndicate/linkedin.mjs';
import { postToBluesky } from './syndicate/bluesky.mjs';

const PUBLISHERS = { linkedin: postToLinkedIn, bluesky: postToBluesky };

// More than this in one push is a bulk import, rather than a launch. Use
// --file for each post that should still go out.
const MAX_PER_PUSH = 2;

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		base: { type: 'string' },
		head: { type: 'string', default: 'HEAD' },
		file: { type: 'string', multiple: true },
		out: { type: 'string', default: 'drafts.json' },
		in: { type: 'string', default: 'drafts.json' },
	},
});

const [command, platform] = positionals;

function summary(markdown) {
	if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
}

function quote(text) {
	return text.split('\n').map((line) => `> ${line}`).join('\n');
}

async function draft() {
	let files = values.file ?? (values.base ? changedPosts(values.base, values.head) : []);
	const drafts = [];

	if (!values.file && files.length > MAX_PER_PUSH) {
		summary(`${files.length} posts were published in one push, so none were syndicated. Run the workflow by hand for any that should go out:\n\n${files.map((f) => `- ${f}`).join('\n')}`);
		files = [];
	}

	for (const file of files) {
		const post = loadPost(file);

		if (!post.syndicate) {
			console.log(`Skipping ${file}: syndicate is false`);
			continue;
		}

		const { linkedin, bluesky } = post.overrides;
		const copy = linkedin && bluesky ? { linkedin, bluesky } : { ...(await writeCopy(post)), ...post.overrides };

		for (const name of Object.keys(PUBLISHERS)) {
			const found = problems(name, copy[name]);
			if (found.length) throw new Error(`The ${name} copy for ${file} ${found.join(', ')}`);
		}

		drafts.push({ post, copy });
		console.log(`Drafted ${file}`);
		summary(`## ${post.title}\n\n${post.url}\n\n### LinkedIn (${copy.linkedin.length} chars)\n\n${quote(copy.linkedin)}\n\n### Bluesky\n\n${quote(copy.bluesky)}\n`);
	}

	if (drafts.length === 0) summary('No newly published posts to syndicate.');
	fs.writeFileSync(values.out, JSON.stringify(drafts, null, '\t'));
	console.log(`${drafts.length} post(s) drafted to ${values.out}`);
}

// Netlify builds after the push, so give the deploy time to land before
// pointing anyone at the article.
async function waitUntilLive(post) {
	const deadline = Date.now() + 20 * 60 * 1000;

	while (Date.now() < deadline) {
		const responses = await Promise.all([post.url, post.image].map((url) => fetch(url, { method: 'HEAD' }).catch(() => null)));
		if (responses.every((response) => response?.ok)) return;

		console.log(`Waiting for ${post.url} to go live...`);
		await new Promise((resolve) => setTimeout(resolve, 30_000));
	}

	throw new Error(`${post.url} wasn't live after 20 minutes`);
}

async function publish() {
	const send = PUBLISHERS[platform];
	if (!send) throw new Error(`Unknown platform "${platform}". Use one of: ${Object.keys(PUBLISHERS).join(', ')}`);

	const drafts = JSON.parse(fs.readFileSync(values.in, 'utf8'));

	for (const { post, copy } of drafts) {
		await waitUntilLive(post);
		const link = await send(post, copy[platform]);
		console.log(`Posted ${post.slug} to ${platform}: ${link}`);
		summary(`- [${post.title}](${link}) on ${platform}`);
	}
}

const commands = { draft, publish };

if (!commands[command]) {
	console.error('Usage: syndicate.mjs <draft|publish> [options]');
	process.exit(1);
}

await commands[command]();
