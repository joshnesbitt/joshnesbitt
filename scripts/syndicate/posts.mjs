// Finds the posts a push has just published and loads what the social copy
// needs from them.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const SITE = 'https://joshnesbitt.dev';

// Older posts arriving in a push are imports or backdated, rather than news.
const MAX_AGE_DAYS = 14;

const COLLECTIONS = {
	'src/content/thought': 'thoughts',
	'src/content/review': 'reviews',
};

function git(...args) {
	return execFileSync('git', args, { encoding: 'utf8' });
}

function splitFrontmatter(source) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { data: {}, body: source };
	return { data: parse(match[1]) ?? {}, body: match[2] };
}

function isPublished(data) {
	return data.published !== false;
}

function isRecent(data) {
	const published = new Date(data.pubDate);
	return Date.now() - published.valueOf() < MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}

function fileAt(ref, file) {
	try {
		return git('show', `${ref}:${file}`);
	} catch {
		return null;
	}
}

// A post counts as newly published when it is added already published, or
// when `published` flips from false to true, and its pubDate is recent. Edits
// to live posts don't count.
export function changedPosts(base, head) {
	const output = git('diff', '--name-status', '--diff-filter=AM', base, head, '--', ...Object.keys(COLLECTIONS));

	return output
		.split('\n')
		.filter(Boolean)
		.map((line) => line.split('\t'))
		.filter(([, file]) => /\.mdx?$/.test(file))
		.filter(([status, file]) => {
			const now = splitFrontmatter(fileAt(head, file) ?? '').data;
			if (!isPublished(now) || !isRecent(now)) return false;
			if (status === 'A') return true;

			const before = splitFrontmatter(fileAt(base, file) ?? '').data;
			return !isPublished(before);
		})
		.map(([, file]) => file);
}

export function loadPost(file) {
	const { data, body } = splitFrontmatter(fs.readFileSync(file, 'utf8'));
	const dir = path.dirname(file);
	const section = COLLECTIONS[dir];
	if (!section) throw new Error(`${file} is not in a syndicated collection`);

	const slug = path.basename(file).replace(/\.mdx?$/, '');

	return {
		file,
		slug,
		title: data.title,
		description: data.description,
		syndicate: data.syndicate !== false,
		overrides: data.social ?? {},
		// MDX imports and components mean nothing to the model.
		body: body.replace(/^import .*$/gm, '').trim(),
		url: `${SITE}/${section}/${slug}/`,
		image: `${SITE}/api/og/${section}/${slug}.png`,
	};
}
