/**
 * Check if a given string is valid Korean.
 *
 * To be valid, a string must have:
 * - at least one hangul character
 * - at least 75% valid characters (hangul, spaces, numbers, punctuation)
 *
 * This does fail for Jamo letters, but in reality I'll be using syllables.
 */
export function isKorean(phrase: string): boolean {
	const threshold = phrase.length * 0.75;

	// Unicode range for Hangul: U+AC00..U+D7AF
	const hangulRange = [44032, 55215];

	// Other valid ranges
	const ranges = [
		// Punctuation, numbers, spaces: U+0020..U+0040
		[32, 64],
		// Other punctuation: U+005B..U+0060
		[91, 96],
		// Other punctuation: U+007B..U+007F
		[123, 127],
		// General Punctuation block: U+2000..U+206F
		[8192, 8303],
	];

	let validCount = 0;
	let hasHangul = false;
	for (let index = 0; index < phrase.length; index++) {
		const letter = phrase.charCodeAt(index);
		const [min, max] = hangulRange;
		if (letter >= min && letter <= max) {
			hasHangul = true;
			validCount++;
			continue;
		}
		for (const [min, max] of ranges) {
			if (letter >= min && letter <= max) {
				validCount++;
				break;
			}
		}
	}

	return hasHangul && validCount > threshold;
}
