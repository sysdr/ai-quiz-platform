/**
 * Prettier Configuration for AI Quiz Platform Backend
 * Prettier automatically formats your code for consistency
 */

module.exports = {
  // Use single quotes for strings
  singleQuote: true,
  
  // Use semicolons at the end of statements
  semi: true,
  
  // Use 2 spaces for indentation
  tabWidth: 2,
  
  // Use spaces instead of tabs
  useTabs: false,
  
  // Print trailing commas wherever possible
  trailingComma: 'es5',
  
  // Print spaces between brackets in object literals
  bracketSpacing: true,
  
  // Put the > of a multi-line HTML element at the end of the last line
  bracketSameLine: false,
  
  // Include parentheses around a sole arrow function parameter
  arrowParens: 'always',
  
  // Wrap lines at 80 characters
  printWidth: 80,
  
  // Which files to format
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babel'
      }
    }
  ]
};