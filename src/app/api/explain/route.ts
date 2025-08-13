import { NextResponse } from "next/server";
import { generateObject, NoObjectGeneratedError, TypeValidationError } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { isKorean } from "@/app/utils/is-korean";
import { type ExplainAnswer } from "@/types";

const cache = new Map<string, ExplainAnswer>();

export async function POST(req: Request) {
	const data = await req.json();
	const input = decodeURIComponent(data.input);
	const key = input;
	if (cache.has(key)) {
		console.log(`Cache hit for ${input}.`);
		const object = cache.get(key);
		return NextResponse.json({ result: object, error: false });
	}

	console.log(`Cache miss for  ${input}, requesting from OpenAI.`);
	let result;
	try {
		if (!isKorean(input)) {
			throw new Error("Input sentence must be in Korean.", {
				cause: `The input sentence was "${input}".`,
			});
		}
		result = await generateObject({
			model: openai("gpt-4.1-nano"),
			schema: z.object({
				sentence: z.string(),
				translation: z.string(),
				breakdown: z.object({
					words: z.array(
						z.object({
							korean: z.string(),
							meaning: z.string(),
							// type: z.string(),
							// notes: z.string().optional(),
						}),
					),
					grammar: z.array(
						z.object({
							structure: z.string(),
							explanation: z.string(),
							example: z.string().optional(),
						}),
					),
				}),
			}),
			prompt: `Can you break down the Korean grammar and vocabulary in the following sentence? Identify and translate all of the words into English, include the exact phrase in the sentence. Identify some key grammatical constructions to know, and explain them in English.\n${input}`,
		});
		if (result.object.sentence !== input) {
			throw new Error("Output sentence does not match input.", {
				cause: `The input sentence was ${input}, but what the AI processed was ${result.object.sentence}.`,
			});
		}
	} catch (error) {
		if (NoObjectGeneratedError.isInstance(error) || TypeValidationError.isInstance(error)) {
			return NextResponse.json(
				{ error: { message: error.message, details: "" } },
				{ status: 500 },
			);
		} else if (error instanceof Error) {
			return NextResponse.json(
				{ error: { message: error.message, details: error.cause } },
				{ status: 500 },
			);
		}
		return NextResponse.json(
			{ error: { message: "There was an error in the request." } },
			{ status: 500 },
		);
	}
	cache.set(key, result.object);

	return NextResponse.json({ result: result.object, error: false });
}
