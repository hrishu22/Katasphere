-- ============================================================================
-- V1: Create Users and Auth Identities Schema
-- CodeForge Platform
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar_url VARCHAR(1024),
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'LOCAL' or 'GOOGLE'
    provider_subject VARCHAR(255),  -- Google sub ID (null for LOCAL)
    password_hash VARCHAR(255),     -- BCrypt hash (null for GOOGLE)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_auth_provider CHECK (provider IN ('LOCAL', 'GOOGLE')),
    CONSTRAINT chk_password_for_local CHECK (
        (provider = 'LOCAL' AND password_hash IS NOT NULL) OR
        (provider = 'GOOGLE' AND password_hash IS NULL)
    )
);

-- Unique index for external provider subjects (e.g. Google subject)
CREATE UNIQUE INDEX idx_auth_identities_provider_subject
    ON auth_identities(provider, provider_subject)
    WHERE provider_subject IS NOT NULL;

-- Enforce at most one LOCAL identity per user
CREATE UNIQUE INDEX idx_auth_identities_user_local
    ON auth_identities(user_id)
    WHERE provider = 'LOCAL';

-- Foreign key lookup index
CREATE INDEX idx_auth_identities_user_id
    ON auth_identities(user_id);

-- User email lookup index (normalized lower-case)
CREATE INDEX idx_users_email_lower
    ON users(LOWER(email));
