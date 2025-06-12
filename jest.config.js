/**
 * Jest configuration for ES modules
 * @type {import('jest').Config}
 */
export default {
  // Test environment
  testEnvironment: "jsdom",

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],

  // Module name mapping for path aliases
  moduleNameMap: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // File extensions to consider
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Transform configuration for TypeScript and JSX
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  // Files to ignore during transformation
  transformIgnorePatterns: [
    "node_modules/(?!(uuid)/)", // Transform uuid module
  ],

  // Test file patterns
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)",
    "<rootDir>/src/**/*.(test|spec).(ts|tsx|js)",
  ],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.(ts|tsx)",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/setupTests.ts",
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Module resolution
  extensionsToTreatAsEsm: [".ts", ".tsx"],

  // Globals for ts-jest
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,
};
