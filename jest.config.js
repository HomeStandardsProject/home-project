module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  preset: "ts-jest/presets/js-with-ts",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/*.test.(ts|tsx)"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.jest.json",
    },
  },
};
