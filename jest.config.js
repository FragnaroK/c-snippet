/** @type {import('jest').Config} */

const config = {
  verbose: true,
  clearMocks: true,
  displayName: { 
    name: 'TEST',
    color: 'blue',
  }, 
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['<rootDir>', 'node_modules']
};

module.exports = config;
