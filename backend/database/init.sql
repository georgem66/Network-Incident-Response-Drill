-- Initialize PostgreSQL database for Network Incident Response Drill Platform
-- This script sets up the initial database structure

-- Create database if it doesn't exist (run this separately if needed)
-- CREATE DATABASE incident_response;

-- Use the database
\c incident_response;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE incident_status AS ENUM ('active', 'completed', 'paused');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE response_step AS ENUM ('identification', 'containment', 'eradication', 'recovery', 'lessons_learned');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role user_role DEFAULT 'student',
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenario attempts table
CREATE TABLE IF NOT EXISTS scenario_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scenario_id VARCHAR(100) NOT NULL,
    status incident_status DEFAULT 'active',
    current_step response_step DEFAULT 'identification',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    hints_used INTEGER DEFAULT 0,
    time_taken INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User step completions table
CREATE TABLE IF NOT EXISTS step_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID REFERENCES scenario_attempts(id) ON DELETE CASCADE,
    step response_step NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score INTEGER DEFAULT 0,
    actions_taken TEXT[],
    notes TEXT
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scenario_id VARCHAR(100) NOT NULL,
    total_score INTEGER DEFAULT 0,
    completion_time INTEGER, -- in seconds
    attempts_count INTEGER DEFAULT 1,
    best_attempt_id UUID REFERENCES scenario_attempts(id),
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, scenario_id)
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(100) NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_scenario_attempts_user_id ON scenario_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_attempts_scenario_id ON scenario_attempts(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scenario_attempts_status ON scenario_attempts(status);
CREATE INDEX IF NOT EXISTS idx_step_completions_attempt_id ON step_completions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_scenario_id ON leaderboard(scenario_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_total_score ON leaderboard(total_score DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenario_attempts_updated_at BEFORE UPDATE ON scenario_attempts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES (
    'admin',
    'admin@incidentresponse.local',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Letweu7h7qtPUu6oS', -- admin123
    'System',
    'Administrator',
    'admin'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample instructor
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES (
    'instructor',
    'instructor@incidentresponse.local',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Letweu7h7qtPUu6oS', -- admin123
    'Jane',
    'Smith',
    'instructor'
) ON CONFLICT (username) DO NOTHING;