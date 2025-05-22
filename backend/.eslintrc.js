/**
 * ESLint Configuration for AI Quiz Platform Backend
 * Using the legacy format for compatibility with CommonJS
 */

module.exports = {
  env: {
    node: true,        // Enable Node.js global variables
    es2022: true,      // Enable modern JavaScript features
    jest: true         // Enable Jest testing globals
  },
  
  extends: [
    'eslint:recommended'  // Use ESLint's recommended rules
  ],
  
  parserOptions: {
    ecmaVersion: 2022,    // Support modern JavaScript syntax
    sourceType: 'commonjs' // Use CommonJS modules
  },
  
  rules: {
    // Error prevention
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-console': 'off',
    'no-debugger': 'error',
    
    // Code style
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    
    // Best practices
    'eqeqeq': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'arrow-spacing': 'error'
  },
  
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/',
    'build/'
  ]
};