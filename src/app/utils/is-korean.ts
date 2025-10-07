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

	// Quick regex check for Hangul presence
	// Unicode range for Hangul: U+AC00..U+D7AF
	const hangulRegex = /[\uAC00-\uD7AF]/;
	if (!hangulRegex.test(phrase)) {
		return false;
	}

	// Count valid characters using regex
	// Punctuation, numbers, spaces: U+0020..U+0040
	// Other punctuation: U+005B..U+0060
	// Other punctuation: U+007B..U+007F
	// General Punctuation block: U+2000..U+206F
	const validCharsRegex = /[\uAC00-\uD7AF\u0020-\u0040\u005B-\u0060\u007B-\u007F\u2000-\u206F]/g;
	const validMatches = phrase.match(validCharsRegex);
	const validCount = validMatches ? validMatches.length : 0;

	return validCount > threshold;
}
