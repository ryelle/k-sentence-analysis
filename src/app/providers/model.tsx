"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DEFAULT_MODEL, MODELS } from "../utils/models";
import type { ModelContextType, Model } from "@/types";

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
