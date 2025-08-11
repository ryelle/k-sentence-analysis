export type ExplainAnswer = {
	sentence: string;
	translation: string;
	breakdown: {
		words: Array<{
			korean: string;
			meaning: string;
			// Currently omitting these from the response because they're not used in the UI.
			type?: string;
			notes?: string;
		}>;
		grammar: Array<{
			structure: string;
			explanation: string;
			example?: string;
		}>;
	};
};
