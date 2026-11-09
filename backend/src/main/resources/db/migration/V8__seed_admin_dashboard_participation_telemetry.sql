-- =============================================================================
-- V8: Seed Institutional Participation, Rankings & Cheat Telemetry for College Admins
-- =============================================================================

-- 1. Ensure all users who own a registered college have role = 'COLLEGE_ADMIN'
UPDATE users
SET role = 'COLLEGE_ADMIN'
WHERE id IN (SELECT admin_user_id FROM colleges WHERE admin_user_id IS NOT NULL);

-- 2. Link NIT Karnataka contest to its tenant_id if not yet linked
UPDATE contests
SET tenant_id = '22222222-2222-2222-2222-222222222202'
WHERE id = '872f2cc6-fb87-440a-b52d-9c44ddd53e52'
  AND EXISTS (SELECT 1 FROM colleges WHERE id = '22222222-2222-2222-2222-222222222202');

-- 3. Ensure IIT Bombay & IIT Delhi contests have problems mapped for maxPoints calculation
INSERT INTO contest_problems (contest_id, problem_id, problem_order, points)
SELECT c.id, p.id, 1, 100
FROM contests c
JOIN problems p ON p.id = 'b0000000-0000-0000-0000-000000000001'
WHERE c.id IN (
    '33333333-3333-3333-3333-333333333301',
    '33333333-3333-3333-3333-333333333302',
    '33333333-3333-3333-3333-333333333303'
)
ON CONFLICT (contest_id, problem_id) DO NOTHING;

INSERT INTO contest_problems (contest_id, problem_id, problem_order, points)
SELECT c.id, p.id, 2, 200
FROM contests c
JOIN problems p ON p.id = 'b0000000-0000-0000-0000-000000000005'
WHERE c.id IN (
    '33333333-3333-3333-3333-333333333301',
    '33333333-3333-3333-3333-333333333302',
    '33333333-3333-3333-3333-333333333303'
)
ON CONFLICT (contest_id, problem_id) DO NOTHING;

-- 4. Seed realistic student candidates for IIT Bombay (708823e4-6070-41b3-9222-0712f61595c1) if that college exists
INSERT INTO users (id, name, email, role, college_id, college_roll_number, tenure_start_year, tenure_end_year)
SELECT '44444444-4444-4444-4444-444444444401', 'Ananya Deshmukh', 'ananya.cs23@iitb.ac.in', 'USER',
       '708823e4-6070-41b3-9222-0712f61595c1', '23B030014', 2023, 2027
WHERE EXISTS (SELECT 1 FROM colleges WHERE id = '708823e4-6070-41b3-9222-0712f61595c1')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, role, college_id, college_roll_number, tenure_start_year, tenure_end_year)
SELECT '44444444-4444-4444-4444-444444444402', 'Rohan Kulkarni', 'rohan.cs23@iitb.ac.in', 'USER',
       '708823e4-6070-41b3-9222-0712f61595c1', '23B030028', 2023, 2027
WHERE EXISTS (SELECT 1 FROM colleges WHERE id = '708823e4-6070-41b3-9222-0712f61595c1')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, role, college_id, college_roll_number, tenure_start_year, tenure_end_year)
SELECT '44444444-4444-4444-4444-444444444403', 'Siddharth Mehta', 'siddharth.cs24@iitb.ac.in', 'USER',
       '708823e4-6070-41b3-9222-0712f61595c1', '24B030042', 2024, 2028
WHERE EXISTS (SELECT 1 FROM colleges WHERE id = '708823e4-6070-41b3-9222-0712f61595c1')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, role, college_id, college_roll_number, tenure_start_year, tenure_end_year)
SELECT '44444444-4444-4444-4444-444444444404', 'Karan Malhotra', 'karan.cs23@iitb.ac.in', 'USER',
       '708823e4-6070-41b3-9222-0712f61595c1', '23B030089', 2023, 2027
WHERE EXISTS (SELECT 1 FROM colleges WHERE id = '708823e4-6070-41b3-9222-0712f61595c1')
ON CONFLICT (email) DO NOTHING;

-- 5. Seed realistic student candidates for IIT Delhi (22222222-2222-2222-2222-222222222201) if that college exists
INSERT INTO users (id, name, email, role, college_id, college_roll_number, tenure_start_year, tenure_end_year)
SELECT '44444444-4444-4444-4444-444444444501', 'Priya Nair', 'priya.cs123@iitd.ac.in', 'USER',
       '22222222-2222-2222-2222-222222222201', '2023CS10412', 2023, 2027
WHERE EXISTS (SELECT 1 FROM colleges WHERE id = '22222222-2222-2222-2222-222222222201')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (id, name, email, role, college_id, college_roll_number, tenure_start_year, tenure_end_year)
SELECT '44444444-4444-4444-4444-444444444502', 'Vikramaditya Singh', 'vikram.cs123@iitd.ac.in', 'USER',
       '22222222-2222-2222-2222-222222222201', '2023CS10455', 2023, 2027
WHERE EXISTS (SELECT 1 FROM colleges WHERE id = '22222222-2222-2222-2222-222222222201')
ON CONFLICT (email) DO NOTHING;

-- 6. Seed contest_participants for IIT Bombay Contest 1 (CS101 Autumn Programming & Data Structures Final)
INSERT INTO contest_participants (id, contest_id, user_id, started_at, submitted_at, total_score, penalty_seconds, tab_switch_count, status)
SELECT '55555555-5555-5555-5555-555555555501',
       '33333333-3333-3333-3333-333333333301',
       '44444444-4444-4444-4444-444444444401',
       NOW() - INTERVAL '3 days',
       NOW() - INTERVAL '3 days' + INTERVAL '48 minutes',
       300, 1420, 0, 'SUBMITTED'
WHERE EXISTS (SELECT 1 FROM contests WHERE id = '33333333-3333-3333-3333-333333333301')
  AND EXISTS (SELECT 1 FROM users WHERE id = '44444444-4444-4444-4444-444444444401')
ON CONFLICT (contest_id, user_id) DO NOTHING;

INSERT INTO contest_participants (id, contest_id, user_id, started_at, submitted_at, total_score, penalty_seconds, tab_switch_count, status)
SELECT '55555555-5555-5555-5555-555555555502',
       '33333333-3333-3333-3333-333333333301',
       '44444444-4444-4444-4444-444444444402',
       NOW() - INTERVAL '3 days',
       NOW() - INTERVAL '3 days' + INTERVAL '62 minutes',
       200, 1980, 0, 'SUBMITTED'
WHERE EXISTS (SELECT 1 FROM contests WHERE id = '33333333-3333-3333-3333-333333333301')
  AND EXISTS (SELECT 1 FROM users WHERE id = '44444444-4444-4444-4444-444444444402')
ON CONFLICT (contest_id, user_id) DO NOTHING;

INSERT INTO contest_participants (id, contest_id, user_id, started_at, submitted_at, total_score, penalty_seconds, tab_switch_count, status)
SELECT '55555555-5555-5555-5555-555555555503',
       '33333333-3333-3333-3333-333333333301',
       '44444444-4444-4444-4444-444444444403',
       NOW() - INTERVAL '3 days',
       NOW() - INTERVAL '3 days' + INTERVAL '74 minutes',
       100, 2310, 1, 'SUBMITTED'
WHERE EXISTS (SELECT 1 FROM contests WHERE id = '33333333-3333-3333-3333-333333333301')
  AND EXISTS (SELECT 1 FROM users WHERE id = '44444444-4444-4444-4444-444444444403')
ON CONFLICT (contest_id, user_id) DO NOTHING;

INSERT INTO contest_participants (id, contest_id, user_id, started_at, submitted_at, total_score, penalty_seconds, tab_switch_count, status)
SELECT '55555555-5555-5555-5555-555555555504',
       '33333333-3333-3333-3333-333333333301',
       '44444444-4444-4444-4444-444444444404',
       NOW() - INTERVAL '3 days',
       NOW() - INTERVAL '3 days' + INTERVAL '39 minutes',
       100, 2540, 4, 'FLAGGED_VIOLATION'
WHERE EXISTS (SELECT 1 FROM contests WHERE id = '33333333-3333-3333-3333-333333333301')
  AND EXISTS (SELECT 1 FROM users WHERE id = '44444444-4444-4444-4444-444444444404')
ON CONFLICT (contest_id, user_id) DO NOTHING;

-- 7. Seed contest_submissions for IIT Bombay Contest 1 so problemsSolved is accurately computed
INSERT INTO contest_submissions (id, contest_id, participant_id, problem_id, language, code, verdict, passed_test_cases, total_test_cases, points_awarded, execution_time_ms, memory_kb)
SELECT '66666666-6666-6666-6666-666666666601',
       '33333333-3333-3333-3333-333333333301',
       '55555555-5555-5555-5555-555555555501',
       'b0000000-0000-0000-0000-000000000001',
       'PYTHON', 'def twoSum(nums, target): pass', 'ACCEPTED', 10, 10, 100, 32, 14200
WHERE EXISTS (SELECT 1 FROM contest_participants WHERE id = '55555555-5555-5555-5555-555555555501')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contest_submissions (id, contest_id, participant_id, problem_id, language, code, verdict, passed_test_cases, total_test_cases, points_awarded, execution_time_ms, memory_kb)
SELECT '66666666-6666-6666-6666-666666666602',
       '33333333-3333-3333-3333-333333333301',
       '55555555-5555-5555-5555-555555555501',
       'b0000000-0000-0000-0000-000000000005',
       'PYTHON', 'def solve(): pass', 'ACCEPTED', 12, 12, 200, 48, 15600
WHERE EXISTS (SELECT 1 FROM contest_participants WHERE id = '55555555-5555-5555-5555-555555555501')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contest_submissions (id, contest_id, participant_id, problem_id, language, code, verdict, passed_test_cases, total_test_cases, points_awarded, execution_time_ms, memory_kb)
SELECT '66666666-6666-6666-6666-666666666603',
       '33333333-3333-3333-3333-333333333301',
       '55555555-5555-5555-5555-555555555502',
       'b0000000-0000-0000-0000-000000000005',
       'CPP', '// C++20 solution', 'ACCEPTED', 12, 12, 200, 14, 9400
WHERE EXISTS (SELECT 1 FROM contest_participants WHERE id = '55555555-5555-5555-5555-555555555502')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contest_submissions (id, contest_id, participant_id, problem_id, language, code, verdict, passed_test_cases, total_test_cases, points_awarded, execution_time_ms, memory_kb)
SELECT '66666666-6666-6666-6666-666666666604',
       '33333333-3333-3333-3333-333333333301',
       '55555555-5555-5555-5555-555555555503',
       'b0000000-0000-0000-0000-000000000001',
       'JAVA', '// Java 21 solution', 'ACCEPTED', 10, 10, 100, 29, 41200
WHERE EXISTS (SELECT 1 FROM contest_participants WHERE id = '55555555-5555-5555-5555-555555555503')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contest_submissions (id, contest_id, participant_id, problem_id, language, code, verdict, passed_test_cases, total_test_cases, points_awarded, execution_time_ms, memory_kb)
SELECT '66666666-6666-6666-6666-666666666605',
       '33333333-3333-3333-3333-333333333301',
       '55555555-5555-5555-5555-555555555504',
       'b0000000-0000-0000-0000-000000000001',
       'PYTHON', '# Flagged session submission', 'ACCEPTED', 10, 10, 100, 38, 14800
WHERE EXISTS (SELECT 1 FROM contest_participants WHERE id = '55555555-5555-5555-5555-555555555504')
ON CONFLICT (id) DO NOTHING;

-- 8. Seed contest_participants for IIT Delhi Contest (e1074447-2c21-40d1-a947-54e788c80018)
INSERT INTO contest_participants (id, contest_id, user_id, started_at, submitted_at, total_score, penalty_seconds, tab_switch_count, status)
SELECT '55555555-5555-5555-5555-555555555601',
       'e1074447-2c21-40d1-a947-54e788c80018',
       '44444444-4444-4444-4444-444444444501',
       NOW() - INTERVAL '1 day',
       NOW() - INTERVAL '1 day' + INTERVAL '52 minutes',
       300, 1510, 0, 'SUBMITTED'
WHERE EXISTS (SELECT 1 FROM contests WHERE id = 'e1074447-2c21-40d1-a947-54e788c80018')
  AND EXISTS (SELECT 1 FROM users WHERE id = '44444444-4444-4444-4444-444444444501')
ON CONFLICT (contest_id, user_id) DO NOTHING;

INSERT INTO contest_participants (id, contest_id, user_id, started_at, submitted_at, total_score, penalty_seconds, tab_switch_count, status)
SELECT '55555555-5555-5555-5555-555555555602',
       'e1074447-2c21-40d1-a947-54e788c80018',
       '44444444-4444-4444-4444-444444444502',
       NOW() - INTERVAL '1 day',
       NOW() - INTERVAL '1 day' + INTERVAL '41 minutes',
       100, 2190, 3, 'FLAGGED_VIOLATION'
WHERE EXISTS (SELECT 1 FROM contests WHERE id = 'e1074447-2c21-40d1-a947-54e788c80018')
  AND EXISTS (SELECT 1 FROM users WHERE id = '44444444-4444-4444-4444-444444444502')
ON CONFLICT (contest_id, user_id) DO NOTHING;
