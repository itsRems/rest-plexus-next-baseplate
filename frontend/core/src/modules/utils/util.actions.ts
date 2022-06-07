export function shortNumber(number: number): string {
	const sign = Math.sign(number);
	number = Math.abs(number);
	const short =
		number > 999
			? number > 999999
				? number % 1000000 === 0
					? (number / 1000000).toFixed(0) + 'M'
					: (number / 1000000).toFixed(1) + 'M'
				: number % 1000 === 0
				? (number / 1000).toFixed(0) + 'k'
				: (number / 1000).toFixed(1) + 'k'
			: number.toString();
	return sign >= 0 ? short : `-${short}`;
}

export function formattedNumber(num: number): string {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

export function padNumber(num: number, size = 2): string {
	let formatted = num.toString();
	while (formatted.length < size) formatted = '0' + num;
	return formatted;
}