export async function POST(req: Request) {
	const { messages }: { messages: string[] } = await req.json();
	console.log(messages);

	return {
		sentence: "드라마를 보느라고 시간이 가는 줄 몰랐어요.",
		translation: "I was so caught up watching a drama that I didn’t realize how time flew by.",
		words: [
			{
				word: "드라마",
				meaning: "drama (TV series)",
				type: "noun (loanword)",
			},
			{
				word: "를",
				meaning: "object particle",
				type: "particle",
			},
			{
				word: "보느라고",
				meaning: "because I was watching",
				type: "verb connector (from 보다 + 느라고)",
			},
			{
				word: "시간",
				meaning: "time",
				type: "noun",
			},
			{
				word: "이",
				meaning: "subject particle",
				type: "particle",
			},
			{
				word: "가는",
				meaning: "passing (modifier form of 가다 — to go/pass)",
				type: "verb modifier",
			},
			{
				word: "줄",
				meaning: "the fact that / the idea that (dependent noun)",
				type: "dependent noun",
			},
			{
				word: "몰랐어요",
				meaning: "didn't know / wasn't aware (past polite form of 모르다)",
				type: "verb (past polite)",
			},
		],
		grammar_points: [
			{
				pattern: "V-느라고",
				description:
					"Used to indicate that one action caused a negative or unintended result due to being occupied with it. Here: '보느라고' = 'because I was watching (the drama)'",
			},
			{
				pattern: "V-는 줄 몰랐어요",
				description:
					"Means 'didn’t realize that...' — expresses unawareness of an action or state. '시간이 가는 줄 몰랐어요' = 'I didn’t realize time was passing.'",
			},
			{
				pattern: "N을/를",
				description:
					"Object particle — marks the object of the verb. '드라마를' = 'the drama (as the thing being watched)'",
			},
			{
				pattern: "N이/가",
				description:
					"Subject particle — marks the subject of the sentence. '시간이' = 'time (as the subject that was passing)'",
			},
		],
	};
}
