module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: process.env.CI !== undefined,
  coverageDirectory: "coverage",
};
