"use client";

import useSWR from "swr";
import Tooltip from "@/app/components/elements/tooltip";
import { type ExplainResponse, type ExplainError } from "@/types";
import { type FragmentList, getWordFragments } from "@/app/utils/get-word-fragments";
import styles from "./explainer.module.css";
import Loader from "./elements/loader";
import Card from "./elements/card";

const fetcher = async (input: string) => {
	try {
		const response = await fetch("/api/explain", {
			method: "POST",
			body: JSON.stringify({ input }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Fetch error:", error);
		throw error;
	}
};

function getHighlightedWords(
	sentence: string,
	vocab: Array<{ korean: string; meaning: string }>,
): Array<React.ReactNode | string> {
	const words: Array<React.ReactNode | string> = [];
	const list: FragmentList = getWordFragments(sentence, vocab);
	list.forEach(({ word, meaning }, i) => {
		if (meaning) {
			words.push(
				<Tooltip key={i} title={meaning}>
					{word}
				</Tooltip>,
			);
		} else {
			words.push(word);
		}
	});
	return words;
}

export default function Explainer({ input }: { input: string }) {
	const { data, isLoading, error } = useSWR<ExplainResponse | ExplainError>(input, fetcher, {
		// Don't need to revalidate, the language isn't going to change.
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});

	if (error) {
		// This is a request-level error (malformed response, etc), ideally
		// would never happen, and definitely not an error I would show to a
		// regular user.
		return <Card title={<span>{error.toString()}</span>} />;
	}

	if (isLoading || !data) {
		return (
			<Card isLoading title={<span>{decodeURIComponent(input)}</span>}>
				<Loader />
			</Card>
		);
	}

	if (data.error) {
		return <Card title={<span>{data.error.message}</span>}>{data.error.details}</Card>;
	}

	const {
		sentence,
		translation,
		breakdown: { words, grammar },
	} = data.result;
	const wordsElement = getHighlightedWords(sentence, words);

	return (
		<Card title={wordsElement} subtitle={translation}>
			{grammar.map(({ structure, explanation, example }, i) => (
				<div className={styles.item} key={i}>
					<h3 lang="ko-KR">{structure}</h3>
					<p>{explanation}</p>
					<p>{example}</p>
				</div>
			))}
		</Card>
	);
}
