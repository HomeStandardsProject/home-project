module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/*.test.(ts|tsx)"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.jest.json",
    },
  },
};
