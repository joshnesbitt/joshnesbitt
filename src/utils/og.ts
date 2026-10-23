// The share image for a page lives at /api/og/<path>.png, with 'index' for
// the home page (see src/pages/api/og/[...path].ts).
function ogImagePath(pathname: string) {
	const path = pathname.replace(/^\/|\/$/g, '');

	return `/api/og/${path || 'index'}.png`;
}

export {
	ogImagePath
}
