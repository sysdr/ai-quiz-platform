/**
 * Unit tests for database configuration and connection management
 */
const DatabaseConfig = require('../../../src/config/database');
const mongoose = require('mongoose');

// Mock mongoose with proper connection object
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  connection: {
    on: jest.fn(),
    readyState: 0
  }
}));

describe('DatabaseConfig', () => {
  let databaseConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    databaseConfig = new DatabaseConfig();
  });

  describe('Constructor', () => {
    test('should initialize with default connection string when env var not set', () => {
      expect(databaseConfig.connectionString).toBe('mongodb://localhost:27017/ai-quiz-platform');
    });

    test('should use environment variable when available', () => {
      const originalEnv = process.env.MONGODB_URI;
      process.env.MONGODB_URI = 'mongodb://test-server:27017/test-db';
      
      const config = new DatabaseConfig();
      expect(config.connectionString).toBe('mongodb://test-server:27017/test-db');
      
      // Restore original env
      if (originalEnv) {
        process.env.MONGODB_URI = originalEnv;
      } else {
        delete process.env.MONGODB_URI;
      }
    });

    test('should have proper connection options configured', () => {
      expect(databaseConfig.options).toEqual(expect.objectContaining({
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }));
    });
  });

  describe('connect()', () => {
    test('should connect successfully with valid configuration', async () => {
      mongoose.connect.mockResolvedValue(true);
      
      // Mock console.log to avoid output during tests
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await databaseConfig.connect();
      
      expect(mongoose.connect).toHaveBeenCalledWith(
        databaseConfig.connectionString,
        databaseConfig.options
      );
      expect(mongoose.connection.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mongoose.connection.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
      
      consoleSpy.mockRestore();
    });

    test('should handle connection errors gracefully', async () => {
      const mockError = new Error('Connection failed');
      mongoose.connect.mockRejectedValue(mockError);
      
      // Mock process.exit to prevent test termination
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await databaseConfig.connect();
      
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to connect to database:', mockError);
      
      mockExit.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('disconnect()', () => {
    test('should disconnect gracefully', async () => {
      mongoose.disconnect.mockResolvedValue(true);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      await databaseConfig.disconnect();
      
      expect(mongoose.disconnect).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    test('should handle disconnect errors', async () => {
      const mockError = new Error('Disconnect failed');
      mongoose.disconnect.mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await expect(databaseConfig.disconnect()).resolves.not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });
});