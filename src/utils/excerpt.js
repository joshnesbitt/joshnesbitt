// The first paragraph of a markdown body as plain text, for descriptions and
// share cards.
function excerpt(body = '', maxLength = 200) {
	const paragraph = body.trim().split(/\n\s*\n/)[0] ?? '';

	const text = paragraph
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[*_`>#]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	if (text.length <= maxLength) return text;

	return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

export {
	excerpt
}
