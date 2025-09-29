-- Initialize Rockket Development Database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create additional databases if needed
-- CREATE DATABASE rockket_test;
-- CREATE DATABASE rockket_staging;

-- Set up any initial data or configurations
-- This file is mounted to /docker-entrypoint-initdb.d/init-db.sql
-- and will be executed automatically when the container starts

-- You can add any initial SQL commands here
-- For example:
-- INSERT INTO users (id, email, name) VALUES ('00000000-0000-0000-0000-000000000000', 'admin@rockket.dev', 'Admin User');
