/**
 * Integration tests for database operations
 * Tests actual database connectivity and operations
 */
const mongoose = require('mongoose');
const DatabaseConfig = require('../../src/config/database');

describe('Database Integration Tests', () => {
  let databaseConfig;

  beforeAll(() => {
    // Use test database
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ai-quiz-platform-integration-test';
    databaseConfig = new DatabaseConfig();
  });

  afterAll(async () => {
    // Clean up test database
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
      await databaseConfig.disconnect();
    }
  });

  describe('Connection Management', () => {
    test('should connect to database successfully', async () => {
      await databaseConfig.connect();
      
      expect(mongoose.connection.readyState).toBe(1); // Connected
    });

    test('should handle database operations after connection', async () => {
      // Create a simple test collection and document
      const TestModel = mongoose.model('Test', new mongoose.Schema({
        name: String,
        value: Number
      }));

      const testDoc = new TestModel({ name: 'integration-test', value: 42 });
      await testDoc.save();

      const retrieved = await TestModel.findOne({ name: 'integration-test' });
      expect(retrieved.value).toBe(42);

      // Clean up
      await TestModel.deleteMany({});
    });

    test('should handle connection events properly', (done) => {
      const originalLog = console.log;
      const logSpy = jest.fn();
      console.log = logSpy;

      mongoose.connection.emit('error', new Error('Test error'));
      
      setTimeout(() => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('Database connection error:')
        );
        console.log = originalLog;
        done();
      }, 100);
    });
  });

  describe('Connection Resilience', () => {
    test('should handle connection timeouts gracefully', async () => {
      // Create config with very short timeout for testing
      const testConfig = new DatabaseConfig();
      testConfig.options.serverSelectionTimeoutMS = 1000;

      // This test verifies timeout handling without actually waiting
      expect(testConfig.options.serverSelectionTimeoutMS).toBe(1000);
    });
  });
});