const jestConfig = {

  testEnvironment: "node",
  testEnvironmentOptions: {
    globalsCleanup: "off",
  },
  testTimeout: 15000,

  transform: {},

  testMatch: [
    "<rootDir>/tests/**/*.test.js",
  ],

  setupFiles: [
    "<rootDir>/tests/setupEnv.js",
  ],

  clearMocks: true,
  restoreMocks: true,
  verbose: true,
};

export default jestConfig;