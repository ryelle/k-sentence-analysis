import { describe, expect, test } from "@jest/globals";
import { ClientError, CLIENT_ERROR_CODES } from "./errors";

describe("ClientError", () => {
	test("should create an error with all properties", () => {
		const error = new ClientError(
			"Test error message",
			CLIENT_ERROR_CODES.INVALID_LANGUAGE,
			"Additional details",
			418
		);

		expect(error.message).toBe("Test error message");
		expect(error.name).toBe("ClientError");
		expect(error.code).toBe(CLIENT_ERROR_CODES.INVALID_LANGUAGE);
		expect(error.details).toBe("Additional details");
		expect(error.status).toBe(418);
	});

	test("should use default status code when not provided", () => {
		const error = new ClientError(
			"Test error",
			CLIENT_ERROR_CODES.EMPTY_INPUT
		);

		expect(error.status).toBe(400);
	});

	test("should correctly identify instances with isInstance", () => {
		const customError = new ClientError(
			"Test",
			CLIENT_ERROR_CODES.INVALID_FORMAT
		);
		const regularError = new Error("Regular error");

		expect(ClientError.isInstance(customError)).toBe(true);
		expect(ClientError.isInstance(regularError)).toBe(false);
		expect(ClientError.isInstance("not an error")).toBe(false);
	});

	test("should maintain proper stack trace", () => {
		const error = new ClientError(
			"Stack trace test",
			CLIENT_ERROR_CODES.INVALID_LANGUAGE
		);

		expect(error.stack).toBeDefined();
		expect(error.stack).toContain("ClientError");
	});
});
