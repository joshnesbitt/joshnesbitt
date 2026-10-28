/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{astro,js,md,mdx,ts}'],
	theme: {
		extend: {
			fontFamily: {
				heading: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
				body: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				paper: 'rgb(var(--color-paper) / <alpha-value>)',
				ink: 'rgb(var(--color-ink) / <alpha-value>)',
				muted: {
					DEFAULT: 'rgb(var(--color-muted) / <alpha-value>)',
					strong: 'rgb(var(--color-muted-strong) / <alpha-value>)',
				},
				rule: 'rgb(var(--color-rule) / <alpha-value>)',
				accent: 'rgb(var(--color-accent) / <alpha-value>)',
			},
			typography: {
				DEFAULT: {
					css: {
						'--tw-prose-body': 'rgb(var(--color-copy))',
						'--tw-prose-headings': 'rgb(var(--color-ink))',
						'--tw-prose-lead': 'rgb(var(--color-copy))',
						'--tw-prose-links': 'rgb(var(--color-ink))',
						'--tw-prose-bold': 'rgb(var(--color-ink))',
						'--tw-prose-counters': 'rgb(var(--color-muted))',
						'--tw-prose-bullets': 'rgb(var(--color-rule))',
						'--tw-prose-hr': 'rgb(var(--color-rule))',
						'--tw-prose-quotes': 'rgb(var(--color-ink))',
						'--tw-prose-quote-borders': 'rgb(var(--color-rule))',
						'--tw-prose-captions': 'rgb(var(--color-muted))',
						'--tw-prose-code': 'rgb(var(--color-ink))',
						'--tw-prose-th-borders': 'rgb(var(--color-rule))',
						'--tw-prose-td-borders': 'rgb(var(--color-rule))',
					},
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography')({
			className: 'markdown',
		}),
	],
};
