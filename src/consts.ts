// -------------
// General
// -------------

export const SITE_TITLE = 'Josh Nesbitt';
export const SITE_HOST = 'joshnesbitt.dev';
export const SITE_URL = `https://${SITE_HOST}`;
export const SITE_DESCRIPTION = "I'm Josh, a CTO based in Leeds with over a decade leading engineering in product-led businesses. I also founded All Day Hey!, one of the UK's longest-running independent technology conferences, and host Off Script, a podcast on engineering leadership and AI.";

export const SOCIAL_LINKS = [
	{ label: 'GitHub', href: 'https://github.com/joshnesbitt' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/josh-nesbitt' },
	{ label: 'Bluesky', href: 'https://bsky.app/profile/joshnesbitt.dev' },
];

// -------------
// Pages
// -------------

// Title and description for each standalone page, keyed by its path ('index'
// for the home page). Pages read their own entry, and the share image route
// renders a card for every key, so a new page only needs adding here.
export const PAGES = {
	index: {
		title: 'Hello',
		description: SITE_DESCRIPTION,
	},
	speaking: {
		title: 'Speaking',
		description: 'Josh speaks, hosts and moderates at technology events — on engineering leadership, AI and building communities.',
	},
	thoughts: {
		title: 'Thoughts',
		description: 'A running log of thoughts on engineering, leadership, AI, running conferences and building teams, products, platforms and communities.',
	},
	reviews: {
		title: 'Reviews',
		description: 'Annual reflections on work and life.',
	},
} satisfies Record<string, { title: string; description: string }>;
