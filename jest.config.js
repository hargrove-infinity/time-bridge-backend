const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // setupFilesAfterEnv: ["./src/test/setup.ts"],
  testMatch: ["**/test/**/*.test.ts"],
};
