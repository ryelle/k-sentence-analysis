import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { type ExplainAnswer } from "@/types";

const cache = new Map<string, ExplainAnswer>();

export async function POST(req: Request) {
	const data = await req.json();
	const input = decodeURIComponent(data.input);
	const key = input;
	if (cache.has(key)) {
		console.log(`Cache hit for ${input}.`);
		const object = cache.get(key);
		return new Response(JSON.stringify(object));
	}

	console.log(`Cache miss for  ${input}, requesting from OpenAI.`);
	let result;
	try {
		result = await generateObject({
			model: openai("gpt-5-nano"),
			schema: z.object({
				sentence: z.string(),
				translation: z.string(),
				breakdown: z.object({
					words: z.array(
						z.object({
							korean: z.string(),
							meaning: z.string(),
							type: z.string(),
							notes: z.string().optional(),
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
			prompt: `Can you break down the Korean grammar and vocab in the following sentence?\n${input}`,
		});
	} catch (error) {
		console.log(result, error);
		return;
	}
	cache.set(key, result.object);

	return result.toJsonResponse();
}
