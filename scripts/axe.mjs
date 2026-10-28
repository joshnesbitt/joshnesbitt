// Runs axe against the key pages of a running site and fails on any
// violation. Point it at a server with BASE_URL (defaults to the dev server).

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const base = process.env.BASE_URL ?? 'http://localhost:4321';

const pages = [
	'/',
	'/thoughts',
	'/thoughts/consistency',
	'/speaking',
	'/reviews',
	'/reviews/2025',
	'/this-page-does-not-exist',
];

const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: 'reduce' });
let failures = 0;

// Astro's error overlay (mounted as <vite-error-overlay>) means the page broke
// in the dev server. It can arrive after load, pushed from another request, so
// check for it after the audit.
const overlayText = (page) =>
	page.evaluate(() => {
		const root = document.querySelector('vite-error-overlay')?.shadowRoot;

		if (!root) return null;

		return ['#name', '#message-content', '#hint-content', '#stack-content']
			.map((selector) => root.querySelector(selector)?.textContent?.trim())
			.filter(Boolean)
			.join('\n    ');
	});

for (const path of pages) {
	const page = await context.newPage();
	const log = [];

	page.on('console', (message) => log.push(`console.${message.type()}: ${message.text()}`));
	page.on('pageerror', (error) => log.push(`pageerror: ${error.message}`));
	page.on('response', (response) => response.status() >= 400 && log.push(`${response.status()} ${response.url()}`));

	await page.goto(base + path, { waitUntil: 'networkidle' });

	// The dev toolbar is Astro's, not the site's.
	const { violations } = await new AxeBuilder({ page }).exclude('astro-dev-toolbar').analyze();
	const overlay = await overlayText(page);

	if (overlay) {
		failures += 1;
		console.log(`✗ ${path}\n  The dev server showed an error:\n    ${overlay.trim().slice(0, 3000)}`);
		log.forEach((line) => console.log(`    ${line}`));
	} else if (violations.length === 0) {
		console.log(`✓ ${path}`);
	} else {
		failures += violations.length;
		console.log(`✗ ${path}`);

		for (const violation of violations) {
			console.log(`  ${violation.id} (${violation.impact}): ${violation.help}`);
			violation.nodes.forEach((node) => console.log(`    ${node.target.join(' ')}`));
		}
	}

	await page.close();
}

await browser.close();

if (failures > 0) {
	console.log(`\n${failures} accessibility violation${failures === 1 ? '' : 's'} found.`);
	process.exit(1);
}
