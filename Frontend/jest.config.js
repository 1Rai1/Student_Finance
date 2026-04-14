module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/styles/**',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|expo|expo-modules-core|@expo|@react-native|@react-navigation|@react-native-async-storage|expo-constants)/)',
  ],
};