/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/*.test.{ts,tsx,js,jsx}',
    '<rootDir>/src/**/*.spec.{ts,tsx,js,jsx}'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/', '/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx,js,jsx}'
  ],
  coverageReporters: ['text', 'html', 'lcov'],
  moduleNameMapper: {
    '^@pages$': '<rootDir>/src/pages',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',

    '^@components$': '<rootDir>/src/components',
    '^@components/(.*)$': '<rootDir>/src/components/$1',

    '^@ui$': '<rootDir>/src/components/ui',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',

    '^@ui-pages$': '<rootDir>/src/components/ui/pages',
    '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',

    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',

    '^@slices$': '<rootDir>/src/services/slices',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',

    '^@selectors$': '<rootDir>/src/services/selectors',
    '^@selectors/(.*)$': '<rootDir>/src/services/selectors/$1',

    '\\.(css|less|scss|sass)$': '<rootDir>/jest/styleMock.js',
    '\\.(jpg|jpeg|png|svg|woff|woff2)$': '<rootDir>/jest/fileMock.js'
  }
};
