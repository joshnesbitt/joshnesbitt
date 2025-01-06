/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    extend: {
      fontFamily: {
        heading: ['"DM Serif Text"', ...defaultTheme.fontFamily.sans],
        body: ['"Nunito Sans"', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'brand-highlight': '#0fdfef',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#212427',
          }
        }
      }
    },
	},
	plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography')({
      className: 'markdown',
    }),
  ],
}
