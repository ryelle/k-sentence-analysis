import { Model, ModelDetails } from "@/types";

export const DEFAULT_MODEL: Model = "solar-pro";
// export const DEFAULT_MODEL: Model = "openai-gpt-5-nano";

export const MODELS: ModelDetails[] = [
	{
		id: "claude-sonnet-4-5-20250929",
		name: "anthropic-claude-sonnet-4-5",
		label: "Claude Sonnet 4.5",
	},
	{
		id: "claude-sonnet-4-20250514",
		name: "anthropic-claude-sonnet-4",
		label: "Claude Sonnet 4",
	},
	{
		id: "claude-3-5-haiku-20241022",
		name: "anthropic-claude-haiku-3-5",
		label: "Claude Haiku 3.5",
	},
	{
		id: "gemini-2.5-pro",
		name: "gemini-2-5-pro",
		label: "Gemini",
	},
	{
		id: "gpt-5-2025-08-07",
		name: "openai-gpt-5",
		label: "ChatGPT 5",
	},
	{
		id: "gpt-5-nano-2025-08-07",
		name: "openai-gpt-5-nano",
		label: "ChatGPT 5 (nano)",
	},
	{
		id: "solar-pro2",
		name: "solar-pro",
		label: "Solar Pro",
	},
];

export function getModelDetails(modelName: string): ModelDetails {
	let model = MODELS.find((m) => m.name === modelName);
	if (model) {
		return model;
	}
	model = MODELS.find((m) => m.name === DEFAULT_MODEL);
	if (model) {
		return model;
	}
	return MODELS[0];
}
