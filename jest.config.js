const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    // ts-jest config moved here (per deprecation warning)
    '^.+\\.(ts|tsx|js)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: false
    }],
  },
  transformIgnorePatterns: ['/node_modules/'],
};