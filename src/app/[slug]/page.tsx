import { Container, Main, Sidebar } from "@/app/components/layout";
import Tooltip from "@/app/components/tooltip";

import data from "./data.json";

// const { slug } = await params;
// <h2>{decodeURIComponent(slug)}</h2>
// export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
// const { slug } = await params;

function getHighlightedWords(
	sentence: string,
	vocab: Array<{ word: string; meaning: string }>,
): Array<React.ReactNode | string> {
	const words: Array<React.ReactNode | string> = [];
	let index = 0;
	vocab.forEach(({ word, meaning }, i) => {
		const nextIndex = sentence.indexOf(word);
		if (index < nextIndex) {
			words.push(sentence.substring(index, nextIndex));
		}
		words.push(
			<Tooltip key={i} title={meaning}>
				{word}
			</Tooltip>,
		);
		index = nextIndex + word.length;
	});
	if (index < sentence.length) {
		words.push(sentence.substring(index));
	}
	return words;
}

export default async function Page() {
	const { sentence, words, grammar_points: grammarPoints } = data;
	const wordsElement = getHighlightedWords(sentence, words);

	return (
		<Container>
			<Sidebar />
			<Main>
				<h2 className="screen-reader-text">Annotated sentence</h2>
				<div style={{ fontSize: "1.5rem" }}>{wordsElement}</div>
				{grammarPoints.map(({ pattern, description }, i) => (
					<div key={i}>
						<h3 lang="ko-KR">{pattern}</h3>
						<p>{description}</p>
					</div>
				))}
			</Main>
		</Container>
	);
}
