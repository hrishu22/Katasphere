-- ============================================================================
-- V2: Create Problems, Tags, Examples, and Test Cases Schema & Seed Data
-- Katasphere Platform
-- ============================================================================

-- Tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- Problems table
CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'EASY', 'MEDIUM', 'HARD'
    constraints_text TEXT NOT NULL,
    starter_code JSONB NOT NULL,
    input_format TEXT,
    output_format TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_difficulty CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD'))
);

-- Problem Tags mapping
CREATE TABLE problem_tags (
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (problem_id, tag_id)
);

-- Problem Examples (Public sample test cases)
CREATE TABLE problem_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    position INT NOT NULL DEFAULT 1,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    explanation TEXT
);

-- Test Cases (Sample + Hidden test cases)
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    position INT NOT NULL DEFAULT 1,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes for efficient queries
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_slug ON problems(slug);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_problem_tags_tag_id ON problem_tags(tag_id);
CREATE INDEX idx_problem_examples_problem_id ON problem_examples(problem_id);
CREATE INDEX idx_test_cases_problem_id ON test_cases(problem_id);

-- ============================================================================
-- Seed Initial Tags
-- ============================================================================
INSERT INTO tags (id, name, slug) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Array', 'array'),
    ('a0000000-0000-0000-0000-000000000002', 'Hash Table', 'hash-table'),
    ('a0000000-0000-0000-0000-000000000003', 'Two Pointers', 'two-pointers'),
    ('a0000000-0000-0000-0000-000000000004', 'String', 'string'),
    ('a0000000-0000-0000-0000-000000000005', 'Dynamic Programming', 'dynamic-programming'),
    ('a0000000-0000-0000-0000-000000000006', 'Binary Search', 'binary-search'),
    ('a0000000-0000-0000-0000-000000000007', 'Sliding Window', 'sliding-window'),
    ('a0000000-0000-0000-0000-000000000008', 'Stack', 'stack'),
    ('a0000000-0000-0000-0000-000000000009', 'Linked List', 'linked-list'),
    ('a0000000-0000-0000-0000-000000000010', 'Math', 'math');

-- ============================================================================
-- Seed Popular Practice Problems
-- ============================================================================

-- 1. Two Sum
INSERT INTO problems (id, slug, title, description, difficulty, constraints_text, starter_code, input_format, output_format)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'two-sum',
    'Two Sum',
    'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
    'EASY',
    '• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.',
    '{
        "PYTHON": "def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    pass",
        "JAVA": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
        "CPP": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};",
        "JAVASCRIPT": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your solution here\n}"
    }'::jsonb,
    'Line 1: Comma-separated integers for nums. Line 2: Single integer target.',
    'Comma-separated indices [index1, index2].'
);

INSERT INTO problem_tags (problem_id, tag_id) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002');

INSERT INTO problem_examples (problem_id, position, input, expected_output, explanation) VALUES
    ('b0000000-0000-0000-0000-000000000001', 1, 'nums = [2,7,11,15], target = 9', '[0,1]', 'Because nums[0] + nums[1] == 9, we return [0, 1].'),
    ('b0000000-0000-0000-0000-000000000001', 2, 'nums = [3,2,4], target = 6', '[1,2]', 'Because nums[1] + nums[2] == 6, we return [1, 2].');

-- 2. Valid Palindrome
INSERT INTO problems (id, slug, title, description, difficulty, constraints_text, starter_code, input_format, output_format)
VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'valid-palindrome',
    'Valid Palindrome',
    'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    'EASY',
    '• 1 <= s.length <= 2 * 10^5
• s consists only of printable ASCII characters.',
    '{
        "PYTHON": "def isPalindrome(s: str) -> bool:\n    # Write your solution here\n    pass",
        "JAVA": "class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution here\n        return false;\n    }\n}",
        "CPP": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Write your solution here\n        return false;\n    }\n};",
        "JAVASCRIPT": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isPalindrome(s) {\n    // Write your solution here\n}"
    }'::jsonb,
    'A single string s.',
    'true or false.'
);

INSERT INTO problem_tags (problem_id, tag_id) VALUES
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003'),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004');

INSERT INTO problem_examples (problem_id, position, input, expected_output, explanation) VALUES
    ('b0000000-0000-0000-0000-000000000002', 1, 's = "A man, a plan, a canal: Panama"', 'true', '"amanaplanacanalpanama" is a palindrome.'),
    ('b0000000-0000-0000-0000-000000000002', 2, 's = "race a car"', 'false', '"raceacar" is not a palindrome.');

-- 3. Longest Substring Without Repeating Characters
INSERT INTO problems (id, slug, title, description, difficulty, constraints_text, starter_code, input_format, output_format)
VALUES (
    'b0000000-0000-0000-0000-000000000003',
    'longest-substring-without-repeating-characters',
    'Longest Substring Without Repeating Characters',
    'Given a string `s`, find the length of the longest substring without repeating characters.',
    'MEDIUM',
    '• 0 <= s.length <= 5 * 10^4
• s consists of English letters, digits, symbols and spaces.',
    '{
        "PYTHON": "def lengthOfLongestSubstring(s: str) -> int:\n    # Write your solution here\n    pass",
        "JAVA": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "CPP": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your solution here\n        return 0;\n    }\n};",
        "JAVASCRIPT": "/**\n * @param {string} s\n * @return {number}\n */\nfunction lengthOfLongestSubstring(s) {\n    // Write your solution here\n}"
    }'::jsonb,
    'A single string s.',
    'Single integer representing the maximum length.'
);

INSERT INTO problem_tags (problem_id, tag_id) VALUES
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004'),
    ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000007');

INSERT INTO problem_examples (problem_id, position, input, expected_output, explanation) VALUES
    ('b0000000-0000-0000-0000-000000000003', 1, 's = "abcabcbb"', '3', 'The answer is "abc", with the length of 3.'),
    ('b0000000-0000-0000-0000-000000000003', 2, 's = "bbbbb"', '1', 'The answer is "b", with the length of 1.');

-- 4. Best Time to Buy and Sell Stock
INSERT INTO problems (id, slug, title, description, difficulty, constraints_text, starter_code, input_format, output_format)
VALUES (
    'b0000000-0000-0000-0000-000000000004',
    'best-time-to-buy-and-sell-stock',
    'Best Time to Buy and Sell Stock',
    'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    'EASY',
    '• 1 <= prices.length <= 10^5
• 0 <= prices[i] <= 10^4',
    '{
        "PYTHON": "def maxProfit(prices: list[int]) -> int:\n    # Write your solution here\n    pass",
        "JAVA": "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your solution here\n        return 0;\n    }\n}",
        "CPP": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your solution here\n        return 0;\n    }\n};",
        "JAVASCRIPT": "/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n    // Write your solution here\n}"
    }'::jsonb,
    'Comma-separated list of stock prices.',
    'Maximum integer profit.'
);

INSERT INTO problem_tags (problem_id, tag_id) VALUES
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005');

INSERT INTO problem_examples (problem_id, position, input, expected_output, explanation) VALUES
    ('b0000000-0000-0000-0000-000000000004', 1, 'prices = [7,1,5,3,6,4]', '5', 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.'),
    ('b0000000-0000-0000-0000-000000000004', 2, 'prices = [7,6,4,3,1]', '0', 'In this case, no transactions are done and the max profit = 0.');

-- 5. Valid Parentheses
INSERT INTO problems (id, slug, title, description, difficulty, constraints_text, starter_code, input_format, output_format)
VALUES (
    'b0000000-0000-0000-0000-000000000005',
    'valid-parentheses',
    'Valid Parentheses',
    'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.',
    'EASY',
    '• 1 <= s.length <= 10^4
• s consists of parentheses only `()[]{}`.',
    '{
        "PYTHON": "def isValid(s: str) -> bool:\n    # Write your solution here\n    pass",
        "JAVA": "class Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n        return false;\n    }\n}",
        "CPP": "#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution here\n        return false;\n    }\n};",
        "JAVASCRIPT": "/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isValid(s) {\n    // Write your solution here\n}"
    }'::jsonb,
    'A single string s.',
    'true or false.'
);

INSERT INTO problem_tags (problem_id, tag_id) VALUES
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000004'),
    ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000008');

INSERT INTO problem_examples (problem_id, position, input, expected_output, explanation) VALUES
    ('b0000000-0000-0000-0000-000000000005', 1, 's = "()"', 'true', 'Matching parentheses of the same type.'),
    ('b0000000-0000-0000-0000-000000000005', 2, 's = "(]"', 'false', 'Mismatched closing bracket type.');

-- 6. Median of Two Sorted Arrays
INSERT INTO problems (id, slug, title, description, difficulty, constraints_text, starter_code, input_format, output_format)
VALUES (
    'b0000000-0000-0000-0000-000000000006',
    'median-of-two-sorted-arrays',
    'Median of Two Sorted Arrays',
    'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).',
    'HARD',
    '• nums1.length == m
• nums2.length == n
• 0 <= m <= 1000
• 0 <= n <= 1000
• 1 <= m + n <= 2000
• -10^6 <= nums1[i], nums2[i] <= 10^6',
    '{
        "PYTHON": "def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    # Write your solution here\n    pass",
        "JAVA": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n}",
        "CPP": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n};",
        "JAVASCRIPT": "/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nfunction findMedianSortedArrays(nums1, nums2) {\n    // Write your solution here\n}"
    }'::jsonb,
    'Line 1: Comma-separated nums1. Line 2: Comma-separated nums2.',
    'Floating point median value with up to 5 decimal places.'
);

INSERT INTO problem_tags (problem_id, tag_id) VALUES
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006');

INSERT INTO problem_examples (problem_id, position, input, expected_output, explanation) VALUES
    ('b0000000-0000-0000-0000-000000000006', 1, 'nums1 = [1,3], nums2 = [2]', '2.00000', 'merged array = [1,2,3] and median is 2.'),
    ('b0000000-0000-0000-0000-000000000006', 2, 'nums1 = [1,2], nums2 = [3,4]', '2.50000', 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.');
