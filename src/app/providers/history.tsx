"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type History = string[];

type HistoryContextType = {
	history: History;
	pushHistory: (slug: string) => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
	const [history, setHistory] = useState<History>([]);
	function pushHistory(slug: string) {
		const list = history.filter((item) => slug !== item);
		setHistory([slug, ...list]);
	}

	return (
		<HistoryContext.Provider value={{ history, pushHistory }}>
			{children}
		</HistoryContext.Provider>
	);
}

export function useHistory(): HistoryContextType {
	const context = useContext(HistoryContext);
	if (context === undefined) {
		throw new Error("useHistory must be used within a HistoryProvider");
	}
	return context;
}
