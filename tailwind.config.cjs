/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
    extend: {
      fontFamily: {
        sans: ['"Heebo"', ...defaultTheme.fontFamily.sans],
        body: ['"Heebo"', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'brand-highlight': '#0fdfef',
      }
    },
	},
	plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}
