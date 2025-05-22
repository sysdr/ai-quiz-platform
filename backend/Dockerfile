# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Add metadata labels
LABEL maintainer="your.email@example.com"
LABEL version="1.0.0"
LABEL description="AI Quiz Platform Backend Service"

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
# Use npm ci for faster, reliable, reproducible builds
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY src/ ./src/

# Change ownership of app directory to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port 3000
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Define the command to run the application
CMD ["node", "src/server.js"]