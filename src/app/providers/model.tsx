"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Model = string;

type ModelContextType = {
	model: Model;
	availableModels: Array<{ name: string; label: string }>;
	setModel: (slug: string) => void;
};

const DEFAULT_MODEL = "openai-gpt-5-nano";
const MODELS = [
    { name: "anthropic-claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
    { name: "anthropic-claude-sonnet-4", label: "Claude Sonnet 4" },
    { name: "anthropic-claude-haiku-3-5", label: "Claude Haiku 3.5" },
    { name: "gemini-2-5-pro", label:"Gemini" },
    { name: "openai-gpt-5", label: "ChatGPT 5" },
    { name: "openai-gpt-5-nano", label: "ChatGPT 5 (nano)" },
];

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({
	children,
	defaultValue = DEFAULT_MODEL,
}: {
	children: ReactNode;
	defaultValue?: string;
}) {
	const [model, _setModel] = useState<Model>(defaultValue);
	const availableModels = MODELS;
	const setModel = (newValue: string) => {
		_setModel(newValue.trim().toLowerCase());
	};

	return (
		<ModelContext.Provider value={{ model, availableModels, setModel }}>
			{children}
		</ModelContext.Provider>
	);
}

export function useModel(): ModelContextType {
	const context = useContext(ModelContext);
	if (context === undefined) {
		throw new Error("useModel must be used within a ModelProvider");
	}
	return context;
}
