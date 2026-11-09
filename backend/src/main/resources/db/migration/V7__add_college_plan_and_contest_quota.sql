-- V7: College subscription plans, contest scheduling quotas, and optional expected_students

ALTER TABLE colleges DROP CONSTRAINT IF EXISTS chk_colleges_expected_students;
ALTER TABLE colleges ALTER COLUMN expected_students DROP NOT NULL;
ALTER TABLE colleges ALTER COLUMN expected_students SET DEFAULT 100;

ALTER TABLE colleges ADD COLUMN IF NOT EXISTS plan_code VARCHAR(40) NOT NULL DEFAULT 'NONE';
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS plan_name VARCHAR(120) NOT NULL DEFAULT 'No Active Plan';
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS contest_quota_total INT NOT NULL DEFAULT 0;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS contests_used INT NOT NULL DEFAULT 0;
ALTER TABLE colleges ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

-- Initialize existing seeded colleges with a Starter Plan (3 Contests / Month)
UPDATE colleges c
SET plan_code = 'STARTER_MONTHLY',
    plan_name = 'Starter Plan (3 Contests / Month)',
    contest_quota_total = 3,
    contests_used = LEAST(3, (SELECT COUNT(*) FROM contests ct WHERE ct.tenant_id = c.id OR LOWER(ct.college_name) = LOWER(c.name))),
    plan_expires_at = NOW() + INTERVAL '30 days'
WHERE c.plan_code = 'NONE';
