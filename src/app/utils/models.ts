import { Model, ModelDetails } from "@/types";

export const DEFAULT_MODEL: Model = "anthropic-claude-haiku-4-5";

export const MODELS: ModelDetails[] = [
	{
		id: "claude-sonnet-4-5-20250929",
		name: "anthropic-claude-sonnet-4-5",
		label: "Claude Sonnet 4.5",
	},
	{
		id: "claude-haiku-4-5-20251001",
		name: "anthropic-claude-haiku-4-5",
		label: "Claude Haiku 4.5",
	},
	{
		id: "gemini-3-pro-preview",
		name: "gemini-3-pro",
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
		label: "Solar Pro (broken)",
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
