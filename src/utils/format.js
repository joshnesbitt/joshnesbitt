function formatMonth(date) {
	return new Date(date).toLocaleDateString('en-uk', { year: 'numeric', month: 'short' });
}

export {
	formatMonth
}
