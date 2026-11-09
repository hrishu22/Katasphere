-- V5: College (tenant) registration + student affiliation
-- A college is registered by exactly one admin user and receives a public, shareable
-- College Unique ID (college_code) that students use to link their profile.

CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    official_email VARCHAR(255) NOT NULL,
    expected_students INT NOT NULL DEFAULT 100,
    department VARCHAR(255),
    website VARCHAR(255),
    phone VARCHAR(32),
    address VARCHAR(500),
    city VARCHAR(120),
    state VARCHAR(120),
    country VARCHAR(120) NOT NULL DEFAULT 'India',
    admin_user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_colleges_expected_students CHECK (expected_students BETWEEN 1 AND 100000)
);

CREATE INDEX IF NOT EXISTS idx_colleges_admin_user_id ON colleges(admin_user_id);

-- Student affiliation (nullable: practice users don't need a college)
ALTER TABLE users ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES colleges(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS college_roll_number VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_users_college_id ON users(college_id);

-- Contests are scoped to a college via the existing tenant_id column
ALTER TABLE contests
    ADD CONSTRAINT fk_contests_tenant_college FOREIGN KEY (tenant_id) REFERENCES colleges(id) ON DELETE SET NULL;

-- Speeds up "my past contests" lookups on the student profile
CREATE INDEX IF NOT EXISTS idx_contest_participants_user_id ON contest_participants(user_id);
