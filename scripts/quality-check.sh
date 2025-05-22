#!/bin/bash

# Comprehensive quality check script with better error handling
echo "🔍 Running quality checks for AI Quiz Platform..."

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Verify we're in the right place
if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found at $BACKEND_DIR"
    echo "Please run this script from the ai-quiz-platform root directory"
    exit 1
fi

echo "📂 Working directory: $PROJECT_ROOT"
echo "🎯 Backend directory: $BACKEND_DIR"

# Change to backend directory
cd "$BACKEND_DIR" || exit 1

# Verify package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend directory"
    exit 1
fi

# Run linting
echo "📝 Running ESLint..."
if npm run lint; then
    echo "✅ Linting passed"
else
    echo "❌ Linting failed. Please fix the issues and try again."
    exit 1
fi

# Run formatting check
echo "🎨 Checking code formatting..."
if npx prettier --check "src/**/*.js" "tests/**/*.js"; then
    echo "✅ Code formatting is correct"
else
    echo "❌ Code formatting issues found. Run 'npm run format' to fix."
    exit 1
fi

# Run tests with coverage
echo "🧪 Running tests with coverage..."
if npm run test:coverage; then
    echo "✅ All tests passed"
else
    echo "❌ Tests failed. Please fix the failing tests."
    exit 1
fi

# Check test coverage thresholds (Jest will handle this automatically)
echo "📊 Coverage thresholds checked by Jest"

# Run security audit
echo "🔒 Running security audit..."
if npm audit --audit-level moderate; then
    echo "✅ No significant security vulnerabilities found"
else
    echo "⚠️  Security vulnerabilities found. Please review and fix."
    # Don't exit on audit failures as they might be false positives
fi

echo "✅ All quality checks completed successfully!"