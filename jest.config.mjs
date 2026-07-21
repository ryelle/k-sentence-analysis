import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig = {
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts", "**/?(*.)+(spec|test).js"],
	moduleFileExtensions: ["ts", "js", "json"],
};

export default createJestConfig(customJestConfig);
