import { NextResponse } from "next/server";
import { generateObject, LanguageModel, NoObjectGeneratedError, TypeValidationError } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { isKorean } from "@/app/utils/is-korean";
import { ClientError, CLIENT_ERROR_CODES } from "@/app/utils/errors";
import LRUCache from "@/app/utils/cache";
import type { ExplainAnswer } from "@/types";
import { DEFAULT_MODEL, getModelDetails, MODELS } from "@/app/utils/models";

// A CJK character is URL encoded to 3 bytes in UTF-8 format by URI encoding.
// These are formatted as %XX, so one character is 3x3=9.
const ENCODED_CHAR = 9;

const cache = new LRUCache<string, ExplainAnswer>(500);
const pendingRequests = new Map<string, Promise<ExplainAnswer>>();

// Input validation schema
const RequestBodySchema = z.object({
	model: z.enum(MODELS.map((m) => m.name)).default(DEFAULT_MODEL),
	input: z
		.string()
		.min(2 * ENCODED_CHAR, "Input sentence is too short, enter a full sentence")
		.max(200 * ENCODED_CHAR, "Input sentence is too long, enter a single sentence at a time")
		.trim(),
});
type RequestBody = z.infer<typeof RequestBodySchema>;

const ResponseSchema = z.object({
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
});

export async function POST(req: Request) {
	// Parse and validate request body
	let input, model;
	try {
		validateRequest(req);
		const data = parseRequest(await req.json());
		model = data.model;
		input = data.input;
	} catch (error) {
		if (ClientError.isInstance(error)) {
			return NextResponse.json(
				{ error: { message: error.message, details: error.details, code: error.code } },
				{ status: error.status },
			);
		}
		return NextResponse.json(
			{ error: { message: "There was an error in the request." } },
			{ status: 500 },
		);
	}

	const key = `${model}::${input}`;

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
	const requestPromise = generateExplanation({ model, input });
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

function validateRequest(req: Request) {
	const contentLength = req.headers.get("content-length");
	if (contentLength) {
		if (parseInt(contentLength) > 2048) {
			throw new ClientError(
				"Request body is too large.",
				CLIENT_ERROR_CODES.INPUT_SIZE,
				"",
				413,
			);
		}
	}
}

function parseRequest(body: unknown): RequestBody {
	const parseResult = RequestBodySchema.safeParse(body);

	if (!parseResult.success) {
		throw new ClientError(
			"Invalid request body",
			CLIENT_ERROR_CODES.INVALID_INPUT,
			parseResult.error.issues.map((issue) => issue.message).join(", "),
			400,
		);
	}

	const data = parseResult.data;
	const input = decodeURIComponent(data.input);
	const model = data.model;

	if (!isKorean(input)) {
		throw new ClientError(
			"Input sentence must be in Korean.",
			CLIENT_ERROR_CODES.INVALID_LANGUAGE,
			`The input sentence was "${data.input}".`,
		);
	}

	return { input, model };
}

async function generateExplanation({
	model,
	input,
}: {
	model: string;
	input: string;
}): Promise<ExplainAnswer> {
	console.log(`Cache miss for  ${input}, requesting from ${model}.`);

	const chosenModel: LanguageModel = getModel(model);

	const prompt = `Can you break down the Korean grammar and vocabulary in the following sentence? Identify and translate all of the words into English, include the exact phrase in the sentence. Identify some key grammatical constructions to know, and explain them in English. Reply in the provided JSON format.\n${input}`;

	const result = await generateObject({
		model: chosenModel,
		schema: ResponseSchema,
		prompt,
		providerOptions: {
			openai: {
				structuredOutputs: true,
			},
		},
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

function getModel(modelName: string): LanguageModel {
	const model = getModelDetails(modelName);
	if (model.name.startsWith("anthropic")) {
		return anthropic(model.id);
	} else if (model.name.startsWith("gemini")) {
		return google(model.id);
	} else if (model.name.startsWith("solar")) {
		const args = {
			baseURL: "https://api.upstage.ai/v1",
			name: "upstage",
			apiKey: process.env.UPSTAGEAI_API_KEY,
			supportsStructuredOutputs: true,
			fetch: async (url: string | Request | URL, options?: RequestInit | undefined) => {
				if (!options) {
					return await fetch(url, options);
				}
				const data = JSON.parse(options.body as string);
				data.response_format.json_schema.strict = true;
				options.body = JSON.stringify(data);
				return await fetch(url, options);
			},
		};
		return createOpenAICompatible(args).chatModel(model.id);
	} else {
		return openai(model.id);
	}
}
