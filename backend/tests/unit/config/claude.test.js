/**
 * Unit tests for Claude AI configuration and client setup
 */
const ClaudeConfig = require('../../../src/config/claude');

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk');

describe('ClaudeConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure API key is set for tests
    process.env.CLAUDE_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.CLAUDE_API_KEY;
  });

  describe('Constructor', () => {
    test('should throw error when API key is missing', () => {
      delete process.env.CLAUDE_API_KEY;
      
      expect(() => new ClaudeConfig()).toThrow('CLAUDE_API_KEY environment variable is required');
    });

    test('should initialize successfully with valid API key', () => {
      const config = new ClaudeConfig();
      
      expect(config.apiKey).toBe('test-api-key');
      expect(config.client).toBeDefined();
      expect(config.defaultConfig).toEqual(expect.objectContaining({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        temperature: 0.7,
      }));
    });
  });

  describe('getClient()', () => {
    test('should return initialized client', () => {
      const config = new ClaudeConfig();
      const client = config.getClient();
      
      expect(client).toBeDefined();
    });
  });

  describe('getDefaultConfig()', () => {
    test('should return copy of default configuration', () => {
      const config = new ClaudeConfig();
      const defaultConfig = config.getDefaultConfig();
      
      // Should be a copy, not the original reference
      expect(defaultConfig).not.toBe(config.defaultConfig);
      expect(defaultConfig).toEqual(config.defaultConfig);
    });
  });

  describe('validateConfiguration()', () => {
    test('should return true for valid configuration', async () => {
      const mockClient = {
        messages: {
          create: jest.fn().mockResolvedValue({
            content: [{ text: 'Hello' }]
          })
        }
      };

      const config = new ClaudeConfig();
      config.client = mockClient;

      const isValid = await config.validateConfiguration();
      
      expect(isValid).toBe(true);
      expect(mockClient.messages.create).toHaveBeenCalledWith(expect.objectContaining({
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      }));
    });

    test('should return false for invalid configuration', async () => {
      const mockClient = {
        messages: {
          create: jest.fn().mockRejectedValue(new Error('API Error'))
        }
      };

      const config = new ClaudeConfig();
      config.client = mockClient;

      const isValid = await config.validateConfiguration();
      
      expect(isValid).toBe(false);
    });
  });
});