export type FragmentList = Array<{ word: string; meaning?: string }>;
export type WordList = Array<{ korean: string; meaning: string }>;

/**
 * Combine a string and list of words to create an array with the full sentence.
 *
 * The vocab list is always in sentence order, but might not contain all sentence words,
 * so this needs to find vocab words and keep the in-between words, such that when you
 * read just the {word}s later, you get the same input sentence.
 */
export function getWordFragments(sentence: string, vocab: WordList): FragmentList {
	if (!sentence) {
		return [];
	}

	const words: FragmentList = [];
	let index = 0;
	vocab.forEach(({ korean, meaning }) => {
		const restOfSentence = sentence.substring(index);
		if (-1 === restOfSentence.indexOf(korean)) {
			return;
		}
		const nextIndex = restOfSentence.indexOf(korean) + index;
		if (index < nextIndex) {
			words.push({ word: sentence.substring(index, nextIndex) });
		}
		words.push({ word: korean, meaning: meaning });
		index = nextIndex + korean.length;
	});

	if (index < sentence.length) {
		words.push({ word: sentence.substring(index) });
	}
	return words;
}
