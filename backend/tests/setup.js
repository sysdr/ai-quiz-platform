/**
 * Jest test setup configuration
 * This file runs before all tests to set up the testing environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/ai-quiz-platform-test';
process.env.CLAUDE_API_KEY = 'test-api-key-for-jest';
process.env.JWT_SECRET = 'test-jwt-secret';

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console.log for cleaner test output
global.console = {
  ...console,
  // Uncomment the next line if you want to silence console.log during tests
  // log: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Helper function to create test user data
  createTestUser: () => ({
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashedpassword123'
  }),
  
  // Helper function to create test quiz data
  createTestQuiz: () => ({
    title: 'Test Quiz',
    topic: 'JavaScript',
    difficultyLevel: 3,
    questions: []
  })
};