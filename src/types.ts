export type ExplainAnswer = {
	sentence: string;
	translation: string;
	breakdown: {
		words: Array<{
			korean: string;
			meaning: string;
			type: string;
			notes?: string;
		}>;
		grammar: Array<{
			structure: string;
			explanation: string;
			example?: string;
		}>;
	};
};
