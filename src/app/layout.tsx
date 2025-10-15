import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, IBM_Plex_Sans, Orbit } from "next/font/google";
import "./globals.css";
import { HistoryProvider } from "./providers/history";
import { ModelProvider } from "./providers/model";

const fontIBMPlexKR = IBM_Plex_Sans_KR({
	weight: ["400", "500"],
	variable: "--font-ibm-plex-kr",
});

const fontIBMPlex = IBM_Plex_Sans({
	weight: "variable",
	variable: "--font-ibm-plex",
});

const fontOrbit = Orbit({
	weight: "400",
	variable: "--font-orbit",
});

export const metadata: Metadata = {
	title: "Korean Sentence Analyzer",
	description: "Parse out grammar of Korean sentences for language learning.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${fontIBMPlexKR.variable} ${fontIBMPlex.variable} ${fontOrbit.variable}`}
			>
				<ModelProvider>
					<HistoryProvider>{children}</HistoryProvider>
				</ModelProvider>
			</body>
		</html>
	);
}
