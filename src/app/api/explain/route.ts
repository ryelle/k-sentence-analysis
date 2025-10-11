import { NextResponse } from "next/server";
import { generateObject, NoObjectGeneratedError, TypeValidationError } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

import { isKorean } from "@/app/utils/is-korean";
import { ClientError, CLIENT_ERROR_CODES } from "@/app/utils/errors";
import LRUCache from "@/app/utils/cache";
import type { ExplainAnswer } from "@/types";

// A CJK character is URL encoded to 3 bytes in UTF-8 format by URI encoding.
// These are formatted as %XX, so one character is 3x3=9.
const ENCODED_CHAR = 9;

const cache = new LRUCache<string, ExplainAnswer>(100);
const pendingRequests = new Map<string, Promise<ExplainAnswer>>();

// Input validation schema
const RequestBodySchema = z.object({
	input: z
		.string()
		.min(2 * ENCODED_CHAR, "Input sentence is too short, enter a full sentence")
		.max(200 * ENCODED_CHAR, "Input sentence is too long, enter a single sentence at a time")
		.trim(),
});

export async function POST(req: Request) {
	const error = validateRequest(req);
	if (error) {
		return NextResponse.json(
			{ error: { message: error.message, details: error.details, code: error.code } },
			{ status: error.status },
		);
	}

	// Parse and validate request body
	let data;
	try {
		const rawBody = await req.json();
		const parseResult = RequestBodySchema.safeParse(rawBody);

		if (!parseResult.success) {
			return NextResponse.json(
				{
					error: {
						message: "Invalid request body",
						details: parseResult.error.issues.map((issue) => issue.message).join(", "),
						code: CLIENT_ERROR_CODES.INVALID_INPUT,
					},
				},
				{ status: 400 },
			);
		}

		data = parseResult.data;
	} catch {
		return NextResponse.json(
			{
				error: {
					message: "Invalid JSON in request body",
					details: "",
					code: CLIENT_ERROR_CODES.INVALID_INPUT,
				},
			},
			{ status: 400 },
		);
	}

	const input = decodeURIComponent(data.input);
	const key = input;

	// Check cache first
	if (cache.has(key)) {
		console.log(`Cache hit for ${input}.`);
		const object = cache.get(key);
		return NextResponse.json({ result: object, error: false });
	}

	// Check if request is already pending
	if (pendingRequests.has(key)) {
		console.log(`Request pending for ${input}, waiting...`);
		const result = await pendingRequests.get(key);
		return NextResponse.json({ result, error: false });
	}

	// Create and store pending promise
	const requestPromise = generateExplanation(input);
	pendingRequests.set(key, requestPromise);

	try {
		const result = await requestPromise;
		cache.set(key, result);
		return NextResponse.json({ result, error: false });
	} catch (error) {
		if (ClientError.isInstance(error)) {
			// The issue is in the client's input content.
			return NextResponse.json(
				{ error: { message: error.message, details: error.details, code: error.code } },
				{ status: error.status },
			);
		} else if (
			NoObjectGeneratedError.isInstance(error) ||
			TypeValidationError.isInstance(error)
		) {
			// The issue is in the AI response.
			return NextResponse.json(
				{ error: { message: error.message, details: "" } },
				{ status: 500 },
			);
		} else if (error instanceof Error) {
			// Something else happened?
			return NextResponse.json(
				{ error: { message: error.message, details: error.cause } },
				{ status: 500 },
			);
		}
		return NextResponse.json(
			{ error: { message: "There was an error in the request." } },
			{ status: 500 },
		);
	} finally {
		pendingRequests.delete(key);
	}
}

function validateRequest(req: Request): ClientError | undefined {
	const contentLength = req.headers.get("content-length");
	if (contentLength) {
		if (parseInt(contentLength) > 2048) {
			return new ClientError(
				"Request body is too large.",
				CLIENT_ERROR_CODES.INPUT_SIZE,
				"",
				413,
			);
		}
	}
}

async function generateExplanation(input: string): Promise<ExplainAnswer> {
	console.log(`Cache miss for  ${input}, requesting from OpenAI.`);
	if (!isKorean(input)) {
		throw new ClientError(
			"Input sentence must be in Korean.",
			CLIENT_ERROR_CODES.INVALID_LANGUAGE,
			`The input sentence was "${input}".`,
		);
	}

	const result = await generateObject({
		model: openai("gpt-5-nano"),
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
		throw new ClientError(
			"Output sentence does not match input.",
			CLIENT_ERROR_CODES.SENTENCE_MISMATCH,
			`The input sentence was ${input}, but what the AI processed was ${result.object.sentence}.`,
		);
	}

	return result.object;
}
