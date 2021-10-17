/** @type {import('@jest/types/build/Config').DefaultOptions} */
module.exports = {
  collectCoverageFrom: ["features/**/*.{ts,tsx}", "!**/*.d.ts"],
  coverageDirectory: "./public/coverage",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
};
