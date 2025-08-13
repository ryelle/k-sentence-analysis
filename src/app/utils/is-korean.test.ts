import { describe, expect, test } from "@jest/globals";
import { isKorean } from "./is-korean";

describe("isKorean", () => {
	test.each([
		{ expected: true, phrase: "과자" },
		{ expected: true, phrase: "실례합니다" },
		{ expected: true, phrase: "고양이 3마리" },
		{ expected: true, phrase: "“합”" },
		{ expected: false, phrase: "snack" },
		{ expected: false, phrase: "3 cats" },
		{ expected: false, phrase: "菓子" },
		{ expected: false, phrase: "discúlpeme" },
		{ expected: false, phrase: "猫3匹" },
		{ expected: false, phrase: "12345" },
	])("Is $expected for $phrase", ({ phrase, expected }) => {
		expect(isKorean(phrase)).toBe(expected);
	});
});
