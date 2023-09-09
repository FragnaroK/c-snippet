
const config = {
  verbose: true,
  displayName: { 
    name: 'TEST',
    color: 'blue',
  }, 
  reporters: [
    "default",
    [
      "@jest-performance-reporter/core",
      {
        "errorAfterMs": 5000,
        "warnAfterMs": 500,
        "logLevel": "warn", 
        "jsonReportPath": "performance-report.json",
        "csvReportPath": "performance-report.csv"
      }
    ]
  ],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['<rootDir>', 'node_modules']
};

module.exports = config;
