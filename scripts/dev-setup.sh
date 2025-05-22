#!/bin/bash

# Development environment setup script
echo "🚀 Setting up AI Quiz Platform development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is installed and running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Installing MongoDB..."
    
    # MongoDB installation varies by OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew tap mongodb/brew
            brew install mongodb-community
        else
            echo "❌ Homebrew is required for MongoDB installation on macOS"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Ubuntu/Debian
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
    else
        echo "❌ Unsupported operating system for automatic MongoDB installation"
        echo "Please install MongoDB manually from https://docs.mongodb.com/manual/installation/"
        exit 1
    fi
fi

# Start MongoDB service
echo "🔄 Starting MongoDB service..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    brew services start mongodb/brew/mongodb-community
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo systemctl start mongod
    sudo systemctl enable mongod
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📄 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your Claude API key and other configuration"
fi

# Install frontend dependencies (when we add frontend)
# echo "📦 Installing frontend dependencies..."
# cd ../frontend
# npm install

echo "✅ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Claude API key"
echo "2. Run 'npm run dev' in the backend directory to start the server"
echo "3. Visit http://localhost:3000/health to verify the setup"