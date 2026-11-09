-- =============================================================================
-- V9: Persist Explicit User Roles (USER, COLLEGE_STUDENT, COLLEGE_ADMIN) in DB
-- =============================================================================

-- 1. All users who own a registered college are stored as COLLEGE_ADMIN
UPDATE users
SET role = 'COLLEGE_ADMIN'
WHERE id IN (SELECT admin_user_id FROM colleges WHERE admin_user_id IS NOT NULL)
  AND role <> 'ADMIN';

-- 2. All users registered with a college (and not owning a college) are stored as COLLEGE_STUDENT
UPDATE users
SET role = 'COLLEGE_STUDENT'
WHERE college_id IS NOT NULL
  AND id NOT IN (SELECT admin_user_id FROM colleges WHERE admin_user_id IS NOT NULL)
  AND role NOT IN ('ADMIN', 'COLLEGE_ADMIN');

-- 3. All users without a college (and not an admin/premium) are stored as USER
UPDATE users
SET role = 'USER'
WHERE college_id IS NULL
  AND id NOT IN (SELECT admin_user_id FROM colleges WHERE admin_user_id IS NOT NULL)
  AND (role IS NULL OR role NOT IN ('ADMIN', 'COLLEGE_ADMIN', 'PREMIUM', 'USER'));

-- 4. Index on users(role) for fast role lookup and tenant isolation
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
