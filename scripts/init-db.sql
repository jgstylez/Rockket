-- Initialize Rockket Database
-- This script runs when the PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create database if it doesn't exist (handled by Docker)
-- The database is created by the POSTGRES_DB environment variable

-- Set up initial configuration
ALTER DATABASE rockket_dev SET timezone TO 'UTC';

-- Create initial admin user (will be handled by application)
-- This is just a placeholder for any initial setup
