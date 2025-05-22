/**
 * Unit tests for main application setup and configuration
 */
const request = require('supertest');
const Application = require('../../src/app');

// Mock dependencies
jest.mock('../../src/config/database');
jest.mock('../../src/config/claude');

describe('Application', () => {
  let application;
  let app;

  beforeEach(() => {
    application = new Application();
    app = application.app;
  });

  afterEach(async () => {
    if (application.server) {
      await application.stop();
    }
  });

  describe('Health endpoint', () => {
    test('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        status: 'healthy',
        timestamp: expect.any(String),
        version: expect.any(String)
      }));
    });
  });

  describe('API info endpoint', () => {
    test('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        message: 'AI Quiz Platform API',
        version: '1.0.0',
        endpoints: expect.any(Object)
      }));
    });
  });

  describe('404 handling', () => {
    test('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/nonexistent-route')
        .expect(404);

      expect(response.body).toEqual(expect.objectContaining({
        error: 'Route not found',
        path: '/nonexistent-route',
        method: 'GET'
      }));
    });
  });

  describe('Error handling middleware', () => {
    test('should handle errors with proper format', async () => {
      // Add a route that throws an error for testing
      app.get('/test-error', (req, res, next) => {
        const error = new Error('Test error');
        error.status = 400;
        next(error);
      });

      const response = await request(app)
        .get('/test-error')
        .expect(400);

      expect(response.body).toEqual(expect.objectContaining({
        error: expect.objectContaining({
          message: 'Test error',
          status: 400,
          timestamp: expect.any(String)
        })
      }));
    });
  });
});