/**
 * Custom error class for input validation errors
 */
export class ClientError extends Error {
	constructor(
		message: string,
		public readonly code: ClientErrorCode,
		public readonly details?: string,
		public readonly status: number = 400
	) {
		super(message);
		this.name = "ClientError";
	}

	static isInstance(error: unknown): error is ClientError {
		return error instanceof ClientError;
	}
}

/**
 * Predefined error codes for common input validation scenarios
 */
export const CLIENT_ERROR_CODES = {
	INVALID_LANGUAGE: "INVALID_LANGUAGE",
	SENTENCE_MISMATCH: "SENTENCE_MISMATCH",
	EMPTY_INPUT: "EMPTY_INPUT",
	INVALID_FORMAT: "INVALID_FORMAT",
} as const;

export type ClientErrorCode = typeof CLIENT_ERROR_CODES[keyof typeof CLIENT_ERROR_CODES];
