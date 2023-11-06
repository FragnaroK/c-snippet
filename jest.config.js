/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  lastCommit: true,
  testEnvironment: 'node', 
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  rootDir: './',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
};