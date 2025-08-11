module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts", "**/?(*.)+(spec|test).js"],
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: false,
			},
		],
	},
	moduleFileExtensions: ["ts", "js", "json"],
};
