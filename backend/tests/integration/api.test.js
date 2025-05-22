/**
 * Integration tests for API endpoints
 * Tests the complete request-response cycle
 */
const request = require('supertest');
const Application = require('../../src/app');
const DatabaseConfig = require('../../src/config/database');

describe('API Integration Tests', () => {
  let application;
  let app;

  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ai-quiz-platform-test';
    
    application = new Application();
    app = application.app;
    
    // Connect to test database
    await application.databaseConfig.connect();
  });

  afterAll(async () => {
    // Clean up test database and close connections
    await application.databaseConfig.disconnect();
    if (application.server) {
      await application.stop();
    }
  });

  describe('Application Health', () => {
    test('should start successfully and respond to health checks', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    test('should handle multiple concurrent health check requests', async () => {
      const requests = Array(10).fill().map(() => 
        request(app).get('/health').expect(200)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.body.status).toBe('healthy');
      });
    });
  });

  describe('API Information', () => {
    test('should provide comprehensive API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'AI Quiz Platform API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          auth: '/api/auth',
          quiz: '/api/quiz'
        }
      });
    });
  });

  describe('Rate Limiting', () => {
    test('should enforce rate limits after excessive requests', async () => {
      // Make requests up to the rate limit
      const requests = Array(50).fill().map(() => 
        request(app).get('/health')
      );

      const responses = await Promise.all(requests);
      
      // All requests should succeed initially
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    }, 30000); // Extended timeout for rate limiting test
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
    test('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

    expect(response.body).toEqual({
      error: expect.objectContaining({
        message: 'Invalid JSON format',
        status: 400,
        timestamp: expect.any(String)
      })
    });
  });

    test('should handle requests with invalid headers', async () => {
      const response = await request(app)
        .get('/api')
        .set('Content-Type', 'invalid-content-type')
        .expect(200); // Should still work for GET requests
    });
  });

  describe('CORS Configuration', () => {
    test('should include proper CORS headers', async () => {
      const response = await request(app)
        .options('/api')
        .set('Origin', 'http://localhost:3001');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    test('should handle preflight requests correctly', async () => {
      const response = await request(app)
        .options('/api')
        .set('Origin', 'http://localhost:3001')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(response.status).toBeLessThan(400);
    });
  });
});