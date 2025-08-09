"use client";

import useSWR from "swr";
import Tooltip from "@/app/components/elements/tooltip";
import { type ExplainAnswer } from "@/types";
import styles from "./explainer.module.css";

const fetcher = (input: string) => {
	return fetch('/api/explain', { method: "POST", body: JSON.stringify({ input }) }).then((res) =>
		res.json(),
	);
};

function getHighlightedWords(
	sentence: string,
	vocab: Array<{ korean: string; meaning: string }>,
): Array<React.ReactNode | string> {
	const words: Array<React.ReactNode | string> = [];
	let index = 0;
	vocab.forEach(({ korean, meaning }, i) => {
		const nextIndex = sentence.indexOf(korean);
		if (index < nextIndex) {
			words.push(sentence.substring(index, nextIndex));
		}
		words.push(
			<Tooltip key={i} title={meaning}>
				{korean}
			</Tooltip>,
		);
		index = nextIndex + korean.length;
	});
	if (index < sentence.length) {
		words.push(sentence.substring(index));
	}
	return words;
}

export default function Explainer({ input }: { input: string }) {
	const { data, isLoading } = useSWR<ExplainAnswer>(input, fetcher, {
		// Don't need to revalided, the language isn't going to change.
		revalidateOnFocus: false,
		revalidateOnReconnect: false
	});
	if (!data || isLoading) {
		return (
			<>
				<div className={styles["heading-placeholder"]}>
					<span>{decodeURIComponent(input)}</span>
				</div>
				<div className={styles.placeholder}></div>
			</>
		);
	}

	const {
		sentence,
        translation,
		breakdown: { words, grammar },
	} = data;
	const wordsElement = getHighlightedWords(sentence, words);

	return (
		<>
			<div className={styles.heading}>{wordsElement}</div>
            <div className={styles.subheading}>{translation}</div>
			{grammar.map(({ structure, explanation, example }, i) => (
				<div className={styles.item} key={i}>
					<h3 lang="ko-KR">{structure}</h3>
					<p>{explanation}</p>
					<p>{example}</p>
				</div>
			))}
		</>
	);
}
