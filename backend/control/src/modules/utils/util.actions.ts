import * as constants from './utils.constants';

export function generateString(length: number): string {
	let output = '';
	for (let i = 0; output.length < length; i++) {
		output += constants.alphabet.charAt(
			Math.floor(Math.random() * constants.alphabet.length)
		);
	}
	return output;
}
