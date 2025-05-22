// MongoDB initialization script for Docker container
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('ai-quiz-platform');

// Create application user with appropriate permissions
db.createUser({
  user: 'quiz-app',
  pwd: 'quiz-app-password',
  roles: [
    {
      role: 'readWrite',
      db: 'ai-quiz-platform'
    }
  ]
});

// Create collections with validation rules
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'passwordHash', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        passwordHash: {
          bsonType: 'string',
          minLength: 60
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

// Create other collections
db.createCollection('quizzes');
db.createCollection('questions');
db.createCollection('quiz_attempts');

// Create compound indexes
db.quiz_attempts.createIndex({ userId: 1, createdAt: -1 });
db.questions.createIndex({ quizId: 1, difficultyLevel: 1 });

print('Database initialization completed successfully');