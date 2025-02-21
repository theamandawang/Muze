// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app directory
});

// Add any custom configuration below
const customJestConfig = {
  // Use jsdom for testing components
  testEnvironment: 'jest-environment-jsdom',

  // If you use module aliasing (e.g. '@/...' paths), you can add a moduleNameMapper:
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Optionally set up global variables, mocks, etc.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

module.exports = createJestConfig(customJestConfig);
