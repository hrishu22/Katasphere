-- V6: Add student tenure years (admission/start year and graduation/pass-out year)
-- Used to verify whether a student is currently active in their college or has passed out.

ALTER TABLE users ADD COLUMN IF NOT EXISTS tenure_start_year INT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenure_end_year INT;
