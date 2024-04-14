// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest';

const customJestConfig: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.ts?(x)",
    "**/?(*.)+(spec|test).ts?(x)"
  ],
  transform: {
    "^.+\\.(js|jsx|mjs|cjs)$": "babel-jest", // Transform JS files with Babel
    "^.+\\.(ts|tsx)$": "ts-jest", // Transform TS files with ts-jest
  },
  verbose: true,
};

const createJestConfig = nextJest({
  dir: './',
});

const jestConfig = async () => {
  const config = await createJestConfig(customJestConfig)();

  return {
    ...config,
    transformIgnorePatterns: [
      "node_modules/(?!(filter-obj|split-on-first|decode-uri-component|query-string)/)",
      '^.+\\.module\\.(css|sass|scss)$',
    ],
  };
};

export default jestConfig;
