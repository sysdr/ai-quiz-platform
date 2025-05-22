/**
 * Main application setup and configuration
 * Initializes Express server with middleware and routes
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const DatabaseConfig = require('./config/database');
const ClaudeConfig = require('./config/claude');

class Application {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.databaseConfig = new DatabaseConfig();
    this.claudeConfig = new ClaudeConfig();
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration for frontend access
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3001',
      credentials: true
    }));
    
    // Rate limiting to prevent abuse
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use(limiter);
    
    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  initializeRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      });
    });
    
    // API routes will be added here as we build them
    this.app.get('/api', (req, res) => {
      res.status(200).json({ 
        message: 'AI Quiz Platform API',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          auth: '/api/auth',
          quiz: '/api/quiz'
        }
      });
    });
  }

  initializeErrorHandling() {
    // 404 handler for undefined routes
    this.app.use((req, res) => {
      res.status(404).json({ 
        error: 'Route not found',
        path: req.path,
        method: req.method
      });
    });
    
    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error('Unhandled error:', error);
      
      const status = error.status || 500;
      const message = error.message || 'Internal server error';
      
      res.status(status).json({
        error: {
          message,
          status,
          timestamp: new Date().toISOString()
        }
      });
    });
  }

  async start() {
    try {
      // Connect to database
      await this.databaseConfig.connect();
      
      // Validate Claude API configuration
      const claudeValid = await this.claudeConfig.validateConfiguration();
      if (!claudeValid) {
        throw new Error('Claude API configuration is invalid');
      }
      console.log('🤖 Claude AI API configured successfully');
      
      // Start server
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`📋 API documentation available at http://localhost:${this.port}/api`);
      });
      
    } catch (error) {
      console.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  async stop() {
    try {
      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
        console.log('🛑 Server stopped');
      }
      
      await this.databaseConfig.disconnect();
      
    } catch (error) {
      console.error('Error stopping application:', error);
    }
  }
}

module.exports = Application;