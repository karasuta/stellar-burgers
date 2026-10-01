import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'jest-css-modules-transform',
    '@pages': '<rootDir>/src/pages',
    '@components': '<rootDir>/src/components',
    '@ui': '<rootDir>/src/components/ui',
    '@ui-pages': '<rootDir>/src/components/ui/pages',
    '@utils-types': '<rootDir>/src/utils/types',
    '@api': '<rootDir>/src/utils/burger-api.ts',
    '@slices': '<rootDir>/src/services/slices',
    '@selectors': '<rootDir>/src/services/selectors'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};

export default config;
