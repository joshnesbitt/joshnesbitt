// Short month and year, as dates appear across the site ("Mar 2025").
function formatMonth(date: Date) {
	return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' });
}

export { formatMonth };
