-- V4: Create Contests and Institutional Examination Schema

-- 1. Contests Table
CREATE TABLE IF NOT EXISTS contests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    college_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    access_code VARCHAR(50) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 90,
    scoring_system VARCHAR(50) NOT NULL DEFAULT 'POINTS',
    allow_tab_switch BOOLEAN NOT NULL DEFAULT TRUE,
    max_tab_switches INT NOT NULL DEFAULT 3,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contests_slug ON contests(slug);
CREATE INDEX IF NOT EXISTS idx_contests_tenant_id ON contests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contests_access_code ON contests(access_code);
CREATE INDEX IF NOT EXISTS idx_contests_time_window ON contests(start_time, end_time);

-- 2. Contest Problems Table
CREATE TABLE IF NOT EXISTS contest_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    problem_order INT NOT NULL DEFAULT 1,
    points INT NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_contest_problem UNIQUE (contest_id, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_contest_problems_contest_id ON contest_problems(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_problems_problem_id ON contest_problems(problem_id);

-- 3. Contest Participants Table
CREATE TABLE IF NOT EXISTS contest_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ,
    total_score INT NOT NULL DEFAULT 0,
    penalty_seconds INT NOT NULL DEFAULT 0,
    tab_switch_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_contest_participant UNIQUE (contest_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_contest_participants_contest_id ON contest_participants(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_participants_user_id ON contest_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_participants_leaderboard ON contest_participants(contest_id, total_score DESC, penalty_seconds ASC);

-- 4. Contest Submissions Table
CREATE TABLE IF NOT EXISTS contest_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES contest_participants(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,
    code TEXT NOT NULL,
    verdict VARCHAR(50) NOT NULL,
    passed_test_cases INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    points_awarded INT DEFAULT 0,
    execution_time_ms BIGINT,
    memory_kb BIGINT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contest_submissions_contest_id ON contest_submissions(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_participant_id ON contest_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_problem_id ON contest_submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_created_at ON contest_submissions(created_at DESC);
