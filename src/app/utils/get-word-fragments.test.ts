import { describe, expect, test } from "@jest/globals";
import { getWordFragments } from "./get-word-fragments";

describe("getWordFragments", () => {
	test("It should parse a sentence", () => {
		// Note: in English for testing.
		const sentence = "This is a sentence.";
		const words = [
			{
				korean: "This",
				meaning: "",
			},
			{
				korean: "is",
				meaning: "",
			},
			{
				korean: "a",
				meaning: "",
			},
			{
				korean: "sentence",
				meaning: "",
			},
		];
		const result = getWordFragments(sentence, words);
		expect(result.reduce((acc, { word }) => acc + word, "")).toEqual(sentence);
	});

	test("It should parse a sentence with incomplete words list", () => {
		// Note: in English for testing.
		const sentence = "This is a sentence.";
		const words = [
			{
				korean: "This",
				meaning: "",
			},
			{
				korean: "a",
				meaning: "",
			},
		];
		const result = getWordFragments(sentence, words);
		expect(result.reduce((acc, { word }) => acc + word, "")).toEqual(sentence);
	});

	test("It should parse a sentence with multiple meanings", () => {
		// Note: in English for testing.
		const sentence = "This is a sentence again.";
		const words = [
			{
				korean: "This",
				meaning: "",
			},
			{
				korean: "is",
				meaning: "",
			},
			{
				korean: "a",
				meaning: "",
			},
			{
				korean: "sentence again",
				meaning: "",
			},
			{
				korean: "sentence",
				meaning: "",
			},
		];
		const result = getWordFragments(sentence, words);
		expect(result.reduce((acc, { word }) => acc + word, "")).toEqual(sentence);
	});

	test("It should parse a sentence with Hangul", () => {
		const sentence = "아이스 아메리카노 두 잔 주세요.";
		const words = [
			{
				korean: "아이스 아메리카노",
				meaning: "iced americano",
			},
			{
				korean: "두",
				meaning: "two",
			},
			{
				korean: "잔",
				meaning: "cups (counter)",
			},
			{
				korean: "주세요",
				meaning: "please give me",
			},
		];
		const result = getWordFragments(sentence, words);
		expect(result.reduce((acc, { word }) => acc + word, "")).toEqual(sentence);
	});

	test("It should parse a sentence with special characters", () => {
		const sentence = "레시피재료에 ‘오이’ 또는 제목에‘오이’문구가 포함 되어야 참여 인정";
		const words = [
			{
				korean: "레시피재료에",
				meaning: "in the recipe ingredients",
			},
			{
				korean: "‘오이’",
				meaning: "the string '오이'",
			},
			{
				korean: "또는",
				meaning: "or",
			},
			{
				korean: "제목에",
				meaning: "in the title",
			},
			{
				korean: "‘오이’문구가",
				meaning: "the phrase '오이' (as the subject)",
			},
			{
				korean: "포함되어야",
				meaning: "must be included",
			},
			{
				korean: "참여",
				meaning: "participation",
			},
			{
				korean: "인정",
				meaning: "recognition",
			},
		];
		const result = getWordFragments(sentence, words);
		expect(result.reduce((acc, { word }) => acc + word, "")).toEqual(sentence);
	});
});
