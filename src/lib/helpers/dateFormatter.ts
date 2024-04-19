const monthNames = [
	'Yanvar',
	'Fevral',
	'Mart',
	'Aprel',
	'May',
	'Iyun',
	'Iyul',
	'Avqust',
	'Sentyabr',
	'Oktyabr',
	'Noyabr',
	'Dekabr'
];

// Function to pad a number with leading zeros
function padNumber(num: any) {
	return num.toString().padStart(2, '0');
}

// Function to format the date
export function formatDate(date: any, dateOnly?: boolean) {
	if (dateOnly) {
		const day = padNumber(date.getDate());
		const month = padNumber(date.getMonth());
		const year = date.getFullYear();
		return `${year}-${month}-${day}`;
	}
	const hours = padNumber(date.getHours());
	const minutes = padNumber(date.getMinutes());
	const day = padNumber(date.getDate());
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();
	return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
