/**
 * Claude AI API configuration and client setup
 * Manages API authentication and request formatting
 */
const Anthropic = require('@anthropic-ai/sdk');

class ClaudeConfig {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is required');
    }
    
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
    
    // Default configuration for quiz generation
    this.defaultConfig = {
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      temperature: 0.7,
    };
  }

  getClient() {
    return this.client;
  }

  getDefaultConfig() {
    return { ...this.defaultConfig };
  }

  /**
   * Validates that the API key is properly configured
   * @returns {boolean} True if configuration is valid
   */
  async validateConfiguration() {
    try {
      const response = await this.client.messages.create({
        model: this.defaultConfig.model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }]
      });
      console.info('Claude API configuration validation failed:', response);
      return true;  // Return boolean, not response.content
    } catch (error) {
      console.error('Claude API configuration validation failed:', error);
      return false;
    }
  }
}

module.exports = ClaudeConfig;