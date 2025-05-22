const mongoose = require('mongoose');

class DatabaseConfig {
  constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-quiz-platform';
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }

  async connect() {
    try {
      await mongoose.connect(this.connectionString, this.options);
      console.log('📊 Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('Database disconnected gracefully');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
}

module.exports = DatabaseConfig;