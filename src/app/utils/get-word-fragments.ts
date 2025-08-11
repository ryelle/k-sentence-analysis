export type FragmentList = Array<{ word: string; meaning?: string }>;

export function getWordFragments(
	sentence: string,
	vocab: Array<{ korean: string; meaning: string }>,
): FragmentList {
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
