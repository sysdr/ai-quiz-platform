/**
 * ESLint Configuration for AI Quiz Platform Backend
 * Using the new flat config format (ESLint v9+)
 * 
 * This configuration sets up linting rules for a Node.js project
 * with modern JavaScript features and best practices.
 */

import js from '@eslint/js';

export default [
  // Base configuration for all JavaScript files
  {
    // Apply to all JavaScript files in src/ and tests/
    files: ['src/**/*.js', 'tests/**/*.js'],
    
    // Extend the recommended JavaScript rules
    ...js.configs.recommended,
    
    // Specify the language options for modern Node.js
    languageOptions: {
      ecmaVersion: 2022,        // Support modern JavaScript features
      sourceType: 'commonjs',   // Use CommonJS modules (require/module.exports)
      globals: {
        // Node.js global variables
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        // Jest testing globals (for test files)
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly'
      }
    },
    
    // Custom rules for code quality and consistency
    rules: {
      // Error prevention rules
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',  // Allow unused args that start with underscore
        varsIgnorePattern: '^_'   // Allow unused variables that start with underscore
      }],
      'no-console': 'off',        // Allow console.log in Node.js backend
      'no-debugger': 'error',     // Prevent debugger statements in production
      
      // Code style rules
      'indent': ['error', 2],     // Use 2-space indentation
      'quotes': ['error', 'single'], // Use single quotes
      'semi': ['error', 'always'], // Require semicolons
      
      // Best practices
      'eqeqeq': 'error',          // Require === instead of ==
      'no-var': 'error',          // Use let/const instead of var
      'prefer-const': 'error',    // Use const when variable is not reassigned
      'arrow-spacing': 'error',   // Require spacing around arrow functions
      
      // Node.js specific rules
      'no-process-exit': 'error', // Prefer throwing errors over process.exit()
      'handle-callback-err': 'error' // Ensure callback errors are handled
    }
  },
  
  // Specific configuration for test files
  {
    files: ['tests/**/*.js'],
    rules: {
      // Relax some rules for test files
      'no-unused-expressions': 'off', // Allow expect() statements
      'max-lines-per-function': 'off' // Allow longer test functions
    }
  },
  
  // Ignore certain files and directories
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**',
      'build/**'
    ]
  }
];