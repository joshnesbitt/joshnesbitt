import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';
import { getPosts } from '../../../utils/finders';
import { PAGES, SITE_HOST, SITE_TITLE } from '../../../consts';

const WIDTH = 1200;
const HEIGHT = 630;

// Prerendered, so a missing font fails the build rather than a share card.
const fontBold = fs.readFileSync(path.join(process.cwd(), 'src/assets/fonts/DMSans-Bold.woff'));
const fontRegular = fs.readFileSync(path.join(process.cwd(), 'src/assets/fonts/DMSans-Regular.woff'));

// Satori can't read CSS custom properties, so these mirror the Paper palette
// tokens at the top of src/styles/application.scss.
const colors = {
	background: '#F6F4EF',
	text: '#1A1917',
	accent: '#46FF10',
};

// URL prefix for each post collection.
const COLLECTIONS = { thoughts: 'thought', reviews: 'review' } as const;

interface PageData {
	title: string;
	description: string;
	url: string;
}

async function getPageData(basePath: string): Promise<PageData | null> {
	if (basePath in PAGES) {
		const page = PAGES[basePath as keyof typeof PAGES];

		return {
			...page,
			url: basePath === 'index' ? SITE_HOST : `${SITE_HOST}/${basePath}`,
		};
	}

	const [prefix, slug] = basePath.split('/');
	const collection = COLLECTIONS[prefix as keyof typeof COLLECTIONS];

	if (!collection || !slug) return null;

	const post = (await getPosts(collection)).find((p) => p.id === slug);

	return post ? { title: post.data.title, description: post.data.description, url: `${SITE_HOST}/${basePath}` } : null;
}

function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).trim() + '...';
}

function generateSvgMarkup(data: PageData) {
	const truncatedDescription = truncate(data.description, 210);
	const truncatedUrl = truncate(data.url, 50);

	return {
		type: 'div',
		props: {
			style: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				boxSizing: 'border-box',
				width: '100%',
				height: '100%',
				backgroundColor: colors.background,
				padding: '60px',
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							flex: 1,
							justifyContent: 'flex-start',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: 72,
										fontWeight: 700,
										color: colors.text,
										lineHeight: 1.1,
										marginBottom: 24,
									},
									children: data.title,
								},
							},
							{
								type: 'div',
								props: {
									style: {
										fontSize: 32,
										fontWeight: 400,
										color: colors.text,
										opacity: 0.8,
										lineHeight: 1.4,
									},
									children: truncatedDescription,
								},
							},
						],
					},
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-end',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: 32,
										fontWeight: 700,
										color: colors.text,
									},
									children: [
										{
											type: 'span',
											props: {
												children: SITE_TITLE,
											},
										},
										{
											type: 'span',
											props: {
												style: {
													color: colors.accent,
												},
												children: '.',
											},
										},
									],
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										justifyContent: 'flex-end',
										textAlign: 'right',
										maxWidth: 720,
										marginLeft: 40,
										fontSize: 24,
										fontWeight: 400,
										color: colors.text,
										opacity: 0.6,
									},
									children: truncatedUrl,
								},
							},
						],
					},
				},
			],
		},
	};
}

export async function getStaticPaths() {
	const posts = await Promise.all(
		Object.entries(COLLECTIONS).map(async ([prefix, collection]) =>
			(await getPosts(collection)).map((post) => `${prefix}/${post.id}`)
		)
	);

	return [...Object.keys(PAGES), ...posts.flat()].map((page) => ({ params: { path: `${page}.png` } }));
}

export const GET: APIRoute = async ({ params }) => {
	const basePath = (params.path || 'index').replace(/\.png$/, '');

	try {
		const pageData = await getPageData(basePath);

		if (!pageData) {
			return new Response('Not found', { status: 404 });
		}

		const markup = generateSvgMarkup(pageData);

		const svg = await satori(markup, {
			width: WIDTH,
			height: HEIGHT,
			fonts: [
				{
					name: 'DM Sans',
					data: fontBold,
					weight: 700,
					style: 'normal',
				},
				{
					name: 'DM Sans',
					data: fontRegular,
					weight: 400,
					style: 'normal',
				},
			],
		});

		const resvg = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: WIDTH,
			},
		});

		const pngData = resvg.render();
		const pngBuffer = pngData.asPng();

		return new Response(new Uint8Array(pngBuffer), {
			status: 200,
			headers: {
				'Content-Type': 'image/png',
			},
		});
	} catch (error) {
		console.error('OG image generation error:', error);
		return new Response('Error generating image', { status: 500 });
	}
};
