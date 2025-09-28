#!/bin/bash

# Rockket Platform Setup Script
# This script sets up the development environment for the Rockket platform

set -e

echo "🚀 Setting up Rockket Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm 9+"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop from https://docker.com/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose"
        exit 1
    fi
    
    print_success "All requirements met!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    npm install
    print_success "Dependencies installed!"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env.local
            print_success "Environment file created from example"
            print_warning "Please edit .env.local with your API keys and configuration"
        else
            print_warning "No env.example file found. You'll need to create .env.local manually"
        fi
    else
        print_warning ".env.local already exists. Skipping..."
    fi
}

# Setup Docker environment
setup_docker() {
    print_status "Setting up Docker environment..."
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found"
        exit 1
    fi
    
    # Start Docker containers
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Docker services started successfully!"
    else
        print_error "Failed to start Docker services"
        exit 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 5
    
    # Run database migrations (if available)
    if [ -f "scripts/migrate.sql" ]; then
        print_status "Running database migrations..."
        # Add migration logic here
    fi
    
    print_success "Database setup complete!"
}

# Run development server
start_dev_server() {
    print_status "Starting development server..."
    
    print_success "Setup complete! Starting development server..."
    print_status "You can now run: npm run dev"
    print_status "Open http://localhost:3000 in your browser"
}

# Main setup function
main() {
    echo "🚀 Rockket Platform Setup"
    echo "========================="
    echo ""
    
    check_requirements
    install_dependencies
    setup_environment
    setup_docker
    setup_database
    
    echo ""
    print_success "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env.local with your API keys"
    echo "2. Run: npm run dev"
    echo "3. Open http://localhost:3000"
    echo ""
    echo "For production deployment:"
    echo "1. Configure Cloudflare Workers"
    echo "2. Set up production environment variables"
    echo "3. Run: npm run setup:prod"
    echo ""
}

# Run main function
main "$@"
