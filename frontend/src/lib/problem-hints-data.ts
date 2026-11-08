/**
 * Progressive Hints Data Provider
 * Provides 4-step progressive hints for coding problems with multi-language code snippets:
 * Step 1: Initial Direction (Hint 1)
 * Step 2: Key Observation & Data Structure (Hint 2)
 * Step 3: Algorithm Recipe / Blueprint (Language-specific code snippet)
 * Step 4: Visual Intuition ("How you can think of the solution")
 */

export interface MultiLanguageCodeHint {
  java?: string;
  python?: string;
  cpp?: string;
  javascript?: string;
}

export interface ProblemHintStep {
  step: 1 | 2 | 3 | 4;
  type: "little" | "more" | "blueprint" | "visual";
  title: string;
  badge: string;
  content: string;
  bullets?: string[];
  codeHint?: string;
  codeHints?: MultiLanguageCodeHint;
  keyTakeaway?: string;
}

export interface ProblemHints {
  problemSlug: string;
  language: string;
  hints: [ProblemHintStep, ProblemHintStep, ProblemHintStep, ProblemHintStep];
}

interface CuratedHintDefinition {
  problemSlug: string;
  step1: {
    title: string;
    content: string;
    bullets: string[];
    keyTakeaway: string;
  };
  step2: {
    title: string;
    content: string;
    bullets: string[];
    keyTakeaway: string;
  };
  step3: {
    title: string;
    contentMap: {
      java: string;
      python: string;
      cpp: string;
      javascript: string;
    };
    bulletsMap: {
      java: string[];
      python: string[];
      cpp: string[];
      javascript: string[];
    };
    codeHints: MultiLanguageCodeHint;
    keyTakeaway: string;
  };
  step4: {
    title: string;
    content: string;
    bullets: string[];
    keyTakeaway: string;
  };
}

const curatedDefinitions: Record<string, CuratedHintDefinition> = {
  "two-sum": {
    problemSlug: "two-sum",
    step1: {
      title: "Hint 1: Avoid Redundant Scans",
      content:
        "A brute force solution would check every pair of numbers using nested loops, which takes O(n²) time. Can you avoid searching the entire array for the second number if you remember what you have already inspected?",
      bullets: [
        "Ask yourself: If you are at a number x, what exact value are you looking for?",
        "Can you keep a record of previously visited numbers as you iterate?",
      ],
      keyTakeaway: "Trade space for time: remember past elements instead of re-scanning.",
    },
    step2: {
      title: "Hint 2: The Power of Complements",
      content:
        "For any current number `num`, the exact complement you need to reach the target is `diff = target - num`.",
      bullets: [
        "Instead of searching forward in the array for `diff`, check if `diff` was already seen in a lookup table.",
        "What data structure provides instant O(1) average lookup time? A Hash Map (or dictionary).",
      ],
      keyTakeaway: "Target complement = `target - num`. Hash tables make lookups O(1).",
    },
    step3: {
      title: "Algorithm Blueprint: One-Pass Hash Table",
      contentMap: {
        java: "Initialize an empty `Map<Integer, Integer> map = new HashMap<>()` mapping number value -> its index. Iterate through `nums` with index `i`:",
        python:
          "Initialize an empty dictionary `prev_map = {}` mapping number value -> its index. Iterate through `nums` with index `i`:",
        cpp: "Initialize an empty `unordered_map<int, int> prevMap` mapping number value -> its index. Iterate through `nums` with index `i`:",
        javascript:
          "Initialize an empty `const prevMap = new Map()` mapping number value -> its index. Iterate through `nums` with index `i`:",
      },
      bulletsMap: {
        java: [
          "1. Calculate `int diff = target - nums[i]`.",
          "2. If `map.containsKey(diff)`, return `new int[]{map.get(diff), i}`.",
          "3. Otherwise, store `map.put(nums[i], i)` and proceed to the next element.",
          "This achieves optimal O(n) time and O(n) auxiliary space.",
        ],
        python: [
          "1. Calculate `diff = target - nums[i]`.",
          "2. If `diff in prev_map`, return `[prev_map[diff], i]`.",
          "3. Otherwise, store `prev_map[nums[i]] = i` and proceed to the next element.",
          "This achieves optimal O(n) time and O(n) auxiliary space.",
        ],
        cpp: [
          "1. Calculate `int diff = target - nums[i]`.",
          "2. If `prevMap.find(diff) != prevMap.end()`, return `{prevMap[diff], i}`.",
          "3. Otherwise, store `prevMap[nums[i]] = i` and proceed to the next element.",
          "This achieves optimal O(n) time and O(n) auxiliary space.",
        ],
        javascript: [
          "1. Calculate `const diff = target - nums[i]`.",
          "2. If `prevMap.has(diff)`, return `[prevMap.get(diff), i]`.",
          "3. Otherwise, store `prevMap.set(nums[i], i)` and proceed to the next element.",
          "This achieves optimal O(n) time and O(n) auxiliary space.",
        ],
      },
      codeHints: {
        java: `Map<Integer, Integer> map = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int diff = target - nums[i];
    if (map.containsKey(diff)) {
        return new int[]{map.get(diff), i};
    }
    map.put(nums[i], i);
}
return new int[]{};`,
        python: `prev_map = {}
for i, n in enumerate(nums):
    diff = target - n
    if diff in prev_map:
        return [prev_map[diff], i]
    prev_map[n] = i
return []`,
        cpp: `unordered_map<int, int> prevMap;
for (int i = 0; i < nums.size(); i++) {
    int diff = target - nums[i];
    if (prevMap.find(diff) != prevMap.end()) {
        return {prevMap[diff], i};
    }
    prevMap[nums[i]] = i;
}
return {};`,
        javascript: `const prevMap = new Map();
for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (prevMap.has(diff)) {
        return [prevMap.get(diff), i];
    }
    prevMap.set(nums[i], i);
}
return [];`,
      },
      keyTakeaway: "Store as you go. You will never match an element with itself.",
    },
    step4: {
      title: "Visualization Hint: How to Think of the Solution",
      content:
        "Picture an array of boxes and a mental ledger on the right. As your pointer steps from left to right, you look into the ledger for the missing puzzle piece. If not there, write down what you just saw. As soon as a number finds its complement already written in the ledger, both indices match!",
      bullets: [
        "Pointer `i` moves forward one box at a time.",
        "The ledger (Hash Map) grows dynamically with `{ value: index }`.",
        "The moment a box requires a complement that is in the ledger, the search halts in O(1) time.",
      ],
      keyTakeaway: "Click 'Launch Visualizer' below to watch this exact memory simulation step-by-step!",
    },
  },

  "best-time-to-buy-and-sell-stock": {
    problemSlug: "best-time-to-buy-and-sell-stock",
    step1: {
      title: "Hint 1: Chronological Ordering",
      content:
        "You must buy before you can sell! That means the buy day must strictly precede the sell day. Can you track the lowest price seen before the current day?",
      bullets: [
        "You do not need to compare every day against every future day (O(n²)).",
        "If you were to sell today, what is the best possible day in the past to have bought?",
      ],
      keyTakeaway: "To maximize profit today, you should have bought at the minimum price seen so far.",
    },
    step2: {
      title: "Hint 2: Maintain Running Min & Max",
      content:
        "You only need two scalar numbers as you scan through the prices from left to right:",
      bullets: [
        "1. `minPrice`: The lowest price encountered from day 0 up to today.",
        "2. `maxProfit`: The highest profit observed so far.",
        "No arrays, stacks, or hash maps are necessary — this requires O(1) constant auxiliary space.",
      ],
      keyTakeaway: "Greedy single-pass approach in O(n) time and O(1) space.",
    },
    step3: {
      title: "Hint 3: Single-Pass Greedy Blueprint",
      contentMap: {
        java: "Initialize `int minPrice = prices[0]` and `int maxProfit = 0`. For each price in `prices`:",
        python:
          "Initialize `min_price = prices[0]` and `max_profit = 0`. For each price in `prices`:",
        cpp: "Initialize `int minPrice = prices[0]` and `int maxProfit = 0`. For each price in `prices`:",
        javascript:
          "Initialize `let minPrice = prices[0]` and `let maxProfit = 0`. For each price in `prices`:",
      },
      bulletsMap: {
        java: [
          "1. Update minimum buy price: `minPrice = Math.min(minPrice, price)`.",
          "2. Calculate current profit: `maxProfit = Math.max(maxProfit, price - minPrice)`.",
          "3. After checking all prices, return `maxProfit`.",
        ],
        python: [
          "1. Update minimum buy price: `min_price = min(min_price, price)`.",
          "2. Calculate current profit: `max_profit = max(max_profit, price - min_price)`.",
          "3. After checking all prices, return `max_profit`.",
        ],
        cpp: [
          "1. Update minimum buy price: `minPrice = min(minPrice, price)`.",
          "2. Calculate current profit: `maxProfit = max(maxProfit, price - minPrice)`.",
          "3. After checking all prices, return `maxProfit`.",
        ],
        javascript: [
          "1. Update minimum buy price: `minPrice = Math.min(minPrice, price)`.",
          "2. Calculate current profit: `maxProfit = Math.max(maxProfit, price - minPrice)`.",
          "3. After checking all prices, return `maxProfit`.",
        ],
      },
      codeHints: {
        java: `int minPrice = prices[0];
int maxProfit = 0;
for (int price : prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
}
return maxProfit;`,
        python: `min_price = prices[0]
max_profit = 0
for price in prices:
    min_price = min(min_price, price)
    max_profit = max(max_profit, price - min_price)
return max_profit`,
        cpp: `int minPrice = prices[0];
int maxProfit = 0;
for (int price : prices) {
    minPrice = min(minPrice, price);
    maxProfit = max(maxProfit, price - minPrice);
}
return maxProfit;`,
        javascript: `let minPrice = prices[0];
let maxProfit = 0;
for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
}
return maxProfit;`,
      },
      keyTakeaway: "Greedily update the valley (minPrice) and peak profit in one pass.",
    },
    step4: {
      title: "Hint 4: Mental Model & Visual Simulation",
      content:
        "Visualize the stock price curve as rolling hills and valleys. Imagine holding a marker at the lowest valley seen so far. Every time the curve climbs higher than the valley, measure the vertical height difference (profit). If the curve dips below your valley marker, slide your marker down to the new lowest valley.",
      bullets: [
        "Valley pointer locks onto the historical minimum.",
        "Current pointer tests the profit margin at every subsequent point.",
      ],
      keyTakeaway: "Click 'Launch Visualizer' to see the valley and profit markers in real-time!",
    },
  },

  "valid-parentheses": {
    problemSlug: "valid-parentheses",
    step1: {
      title: "Hint 1: Last In, First Out (LIFO)",
      content:
        "Notice the nesting structure of brackets: the bracket that was opened most recently must be closed before any earlier brackets can be closed (e.g. in `([{}])`, `{}` closes first, then `[]`, then `()`).",
      bullets: [
        "What classic data structure operates on Last-In, First-Out (LIFO) order?",
        "Can you push open brackets and pop them when you encounter their closing counterpart?",
      ],
      keyTakeaway: "LIFO matching naturally suggests using a Stack.",
    },
    step2: {
      title: "Hint 2: Matching Pairs with a Map",
      content:
        "Map each opening bracket to its corresponding closing bracket, or each closing bracket to its opening partner.",
      bullets: [
        "Whenever you encounter an opening bracket `(`, `{`, `[`, push it or its expected closer onto the stack.",
        "Whenever you encounter a closing bracket, verify that the stack is not empty and matches the expected bracket.",
      ],
      keyTakeaway: "Stack stores open brackets; map validates closing brackets.",
    },
    step3: {
      title: "Hint 3: Stack Processing Blueprint",
      contentMap: {
        java: "Use `Deque<Character> stack = new ArrayDeque<>()` to track open brackets. Iterate through characters in string `s`:",
        python:
          "Initialize an empty list `stack = []`. Iterate through each character `c` in `s`:",
        cpp: "Use `stack<char> st` to track open brackets. Iterate through each character `c` in `s`:",
        javascript:
          "Initialize an empty array `const stack = []`. Iterate through each character `c` in `s`:",
      },
      bulletsMap: {
        java: [
          "1. If `c == '('` push `')'`; if `'{'` push `'}'`; if `'['` push `']'`.",
          "2. Else, if stack is empty or `stack.pop() != c`, return `false`.",
          "3. At the end, return `stack.isEmpty()` (all opened brackets were matched).",
        ],
        python: [
          "1. If `c in pairs`: if `not stack or stack.pop() != pairs[c]`, return `False`.",
          "2. Else, `stack.append(c)`.",
          "3. At the end, return `len(stack) == 0`.",
        ],
        cpp: [
          "1. If `c == '('` push `')'`; if `'{'` push `'}'`; if `'['` push `']'`.",
          "2. Else, if `st.empty() || st.top() != c`, return `false`; otherwise `st.pop()`.",
          "3. At the end, return `st.empty()`.",
        ],
        javascript: [
          "1. If `c === '('` push `')'`; if `'{'` push `'}'`; if `'['` push `']'`.",
          "2. Else, if `stack.length === 0 || stack.pop() !== c`, return `false`.",
          "3. At the end, return `stack.length === 0`.",
        ],
      },
      codeHints: {
        java: `Deque<Character> stack = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(') stack.push(')');
    else if (c == '{') stack.push('}');
    else if (c == '[') stack.push(']');
    else if (stack.isEmpty() || stack.pop() != c) return false;
}
return stack.isEmpty();`,
        python: `stack = []
pairs = {')': '(', '}': '{', ']': '['}
for c in s:
    if c in pairs:
        if not stack or stack.pop() != pairs[c]:
            return False
    else:
        stack.append(c)
return len(stack) == 0`,
        cpp: `stack<char> st;
for (char c : s) {
    if (c == '(') st.push(')');
    else if (c == '{') st.push('}');
    else if (c == '[') st.push(']');
    else {
        if (st.empty() || st.top() != c) return false;
        st.pop();
    }
}
return st.empty();`,
        javascript: `const stack = [];
for (const c of s) {
    if (c === '(') stack.push(')');
    else if (c === '{') stack.push('}');
    else if (c === '[') stack.push(']');
    else if (stack.length === 0 || stack.pop() !== c) return false;
}
return stack.length === 0;`,
      },
      keyTakeaway: "Don't forget the final check: stack must be empty for complete closure.",
    },
    step4: {
      title: "Hint 4: Mental Model & Visual Simulation",
      content:
        "Think of a cafeteria plate dispenser. Every open bracket is a plate stacked on top. A matching closing bracket lifts the top plate off. If an incoming closing bracket does not match the top plate, the tower topples (invalid!). If all plates are cleanly cleared at the end, the string is valid.",
      bullets: [
        "Stack grows upwards with open brackets.",
        "Closing brackets dissolve matching top items.",
      ],
      keyTakeaway: "Click 'Launch Visualizer' to watch the stack push and pop brackets live!",
    },
  },

  "maximum-subarray": {
    problemSlug: "maximum-subarray",
    step1: {
      title: "Hint 1: Discarding Toxic Prefixes",
      content:
        "If the running sum of a contiguous subarray drops below 0, can adding it to any future number ever help increase the sum?",
      bullets: [
        "A negative prefix only reduces the potential of whatever comes after it.",
        "When should you abandon a running subarray and start fresh?",
      ],
      keyTakeaway: "Whenever running sum < 0, reset it to 0 and start a fresh subarray.",
    },
    step2: {
      title: "Hint 2: Kadane's Local vs Global Maximum",
      content:
        "At each index `i`, you have two choices for `currentSum`:",
      bullets: [
        "1. Extend the existing subarray: `currentSum + nums[i]`.",
        "2. Start a new subarray beginning at `nums[i]` itself.",
        "Hence: `currentSum = max(nums[i], currentSum + nums[i])`.",
      ],
      keyTakeaway: "At each step, decide whether to continue the prefix or start over.",
    },
    step3: {
      title: "Hint 3: Kadane's Algorithm Blueprint",
      contentMap: {
        java: "Initialize `int currentSum = nums[0]` and `int maxSum = nums[0]`. Iterate through `nums` starting from index 1:",
        python:
          "Initialize `current_sum = max_sum = nums[0]`. Iterate through `nums` starting from index 1:",
        cpp: "Initialize `int currentSum = nums[0]` and `int maxSum = nums[0]`. Iterate through `nums` starting from index 1:",
        javascript:
          "Initialize `let currentSum = nums[0]` and `let maxSum = nums[0]`. Iterate through `nums` starting from index 1:",
      },
      bulletsMap: {
        java: [
          "1. `currentSum = Math.max(nums[i], currentSum + nums[i])`",
          "2. `maxSum = Math.max(maxSum, currentSum)`",
          "3. Return `maxSum`.",
          "Runs in O(n) linear time with O(1) auxiliary memory.",
        ],
        python: [
          "1. `current_sum = max(num, current_sum + num)`",
          "2. `max_sum = max(max_sum, current_sum)`",
          "3. Return `max_sum`.",
          "Runs in O(n) linear time with O(1) auxiliary memory.",
        ],
        cpp: [
          "1. `currentSum = max(nums[i], currentSum + nums[i])`",
          "2. `maxSum = max(maxSum, currentSum)`",
          "3. Return `maxSum`.",
          "Runs in O(n) linear time with O(1) auxiliary memory.",
        ],
        javascript: [
          "1. `currentSum = Math.max(nums[i], currentSum + nums[i])`",
          "2. `maxSum = Math.max(maxSum, currentSum)`",
          "3. Return `maxSum`.",
          "Runs in O(n) linear time with O(1) auxiliary memory.",
        ],
      },
      codeHints: {
        java: `int currentSum = nums[0];
int maxSum = nums[0];
for (int i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
}
return maxSum;`,
        python: `current_sum = max_sum = nums[0]
for num in nums[1:]:
    current_sum = max(num, current_sum + num)
    max_sum = max(max_sum, current_sum)
return max_sum`,
        cpp: `int currentSum = nums[0];
int maxSum = nums[0];
for (size_t i = 1; i < nums.size(); i++) {
    currentSum = max(nums[i], currentSum + nums[i]);
    maxSum = max(maxSum, currentSum);
}
return maxSum;`,
        javascript: `let currentSum = nums[0];
let maxSum = nums[0];
for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
}
return maxSum;`,
      },
      keyTakeaway: "Simple linear scan tracking running sum and peak sum.",
    },
    step4: {
      title: "Hint 4: Mental Model & Visual Simulation",
      content:
        "Imagine walking along an elevation trail. If your elevation dips beneath sea level (negative sum), you are carrying dead weight — drop it and reset to zero. Keep a photo of the highest altitude you ever reached.",
      bullets: [
        "Sliding subarray window expands while sum stays healthy.",
        "Subarray window resets the moment it drags into negative territory.",
      ],
      keyTakeaway: "Click 'Launch Visualizer' to see the running sum and max subarray span animated!",
    },
  },
};

/**
 * Normalizes input language into canonical keys: 'java' | 'python' | 'cpp' | 'javascript'
 */
export function normalizeLanguage(lang?: string): "java" | "python" | "cpp" | "javascript" {
  if (!lang) return "java";
  const lower = lang.toLowerCase().trim();
  if (lower.startsWith("py")) return "python";
  if (lower.startsWith("c+") || lower.startsWith("cpp")) return "cpp";
  if (lower.startsWith("js") || lower.startsWith("node") || lower.includes("script")) return "javascript";
  return "java";
}

/**
 * Intelligent Fallback Generator for any problem
 */
function generateGenericHints(
  problemSlug: string,
  title: string,
  tags: string[] = [],
  langKey: "java" | "python" | "cpp" | "javascript" = "java"
): ProblemHints {
  const isSearch = tags.some((t) => t.toLowerCase().includes("binary") || t.toLowerCase().includes("search"));

  if (isSearch) {
    const codeHints: MultiLanguageCodeHint = {
      java: `int left = 0, right = nums.length - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
}
return -1;`,
      python: `left, right = 0, len(nums) - 1
while left <= right:
    mid = (left + right) // 2
    if nums[mid] == target: return mid
    elif nums[mid] < target: left = mid + 1
    else: right = mid - 1
return -1`,
      cpp: `int left = 0, right = nums.size() - 1;
while (left <= right) {
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
}
return -1;`,
      javascript: `let left = 0, right = nums.length - 1;
while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
}
return -1;`,
    };

    return {
      problemSlug,
      language: langKey,
      hints: [
        {
          step: 1,
          type: "little",
          title: "Hint 1: Exploit Monotonicity / Sorting",
          badge: "Hint 1 • Initial Direction",
          content:
            "Is the input sorted or can it be partitioned into monotonic halves? If an array is sorted, scanning every element one-by-one (O(n)) is doing unnecessary work.",
          bullets: ["Can you eliminate half of the remaining elements at each step?"],
          keyTakeaway: "Divide and conquer can reduce O(n) to O(log n).",
        },
        {
          step: 2,
          type: "more",
          title: "Hint 2: Binary Search Boundaries",
          badge: "Hint 2 • Key Insight",
          content:
            "Maintain two pointers `left` and `right`. In each step, calculate the midpoint safely to avoid integer overflow.",
          bullets: [
            "Compare `nums[mid]` against target.",
            "If `nums[mid] < target`, discard the left half by setting `left = mid + 1`.",
            "If `nums[mid] > target`, discard the right half by setting `right = mid - 1`.",
          ],
          keyTakeaway: "Strictly shrink search range [left, right] on each iteration.",
        },
        {
          step: 3,
          type: "blueprint",
          title: "Hint 3: Binary Search Blueprint",
          badge: "Hint 3 • Solution Blueprint",
          content: "Initialize boundary pointers. Shrink interval while `left <= right`:",
          bullets: [
            "Calculate middle index `mid`.",
            "If target is found, return `mid`.",
            "Adjust `left` or `right` according to comparison.",
            "Return -1 if element is not present.",
          ],
          codeHint: codeHints[langKey],
          codeHints,
          keyTakeaway: "Logarithmic O(log n) time and O(1) auxiliary space.",
        },
        {
          step: 4,
          type: "visual",
          title: "Hint 4: Mental Model & Visual Simulation",
          badge: "Hint 4 • Visual Intuition",
          content:
            "Visualize a phone book or dictionary. You open directly to the middle page. If the word you want comes alphabetically later, you tear away the entire left half of the book and repeat on the remaining pages.",
          bullets: ["Search interval shrinks by half at every comparison."],
          keyTakeaway: "Click 'Launch Visualizer' to watch the left, mid, and right pointers narrow in!",
        },
      ],
    };
  }

  // General Algorithmic Pattern Fallback
  const genericCodeHints: MultiLanguageCodeHint = {
    java: `// 1. Initialize variables & collections
// 2. Iterate through input and update state
// 3. Return final computed result`,
    python: `# 1. Initialize variables & data structures
# 2. Iterate through input and update state
# 3. Return final computed result`,
    cpp: `// 1. Initialize variables & collections
// 2. Iterate through input and update state
// 3. Return final computed result`,
    javascript: `// 1. Initialize variables & collections
// 2. Iterate through input and update state
// 3. Return final computed result`,
  };

  return {
    problemSlug,
    language: langKey,
    hints: [
      {
        step: 1,
        type: "little",
        title: `Hint 1: Analyze Core Constraints of ${title}`,
        badge: "Hint 1 • Initial Direction",
        content:
          "Start by considering what a straightforward naive approach would look like. What repeated calculations or comparisons are making it slow?",
        bullets: [
          "Look at the input size: does N allow an O(n) or O(n log n) solution?",
          "Can you break the problem down into smaller independent subproblems?",
        ],
        keyTakeaway: "Clarify inputs, edge cases (empty array, size 1), and target complexity.",
      },
      {
        step: 2,
        type: "more",
        title: "Hint 2: Optimal Data Structure Selection",
        badge: "Hint 2 • Key Insight",
        content:
          "Consider which data structure unlocks the fastest lookups or state transitions for this pattern:",
        bullets: [
          "Hash Map / Set: Instant O(1) lookups and frequency tracking.",
          "Two Pointers: In-place scans when data is sorted or symmetric.",
          "Stack / Queue: Preserving order of unfinished operations (LIFO / FIFO).",
          "Dynamic Programming: Caching answers to repeated overlapping subproblems.",
        ],
        keyTakeaway: "Match the problem characteristics with the appropriate pattern.",
      },
      {
        step: 3,
        type: "blueprint",
        title: "Hint 3: Step-by-Step Logic Blueprint",
        badge: "Hint 3 • Solution Blueprint",
        content: "Structure your solution into three clean phases:",
        bullets: [
          "1. Initialization: Set up your base cases, pointers, or auxiliary cache.",
          "2. Main Loop: Iterate through the input, updating state according to your invariant.",
          "3. Output / Edge Handling: Return the collected result and verify constraints.",
        ],
        codeHint: genericCodeHints[langKey],
        codeHints: genericCodeHints,
        keyTakeaway: "Write clean invariants and handle empty or boundary inputs first.",
      },
      {
        step: 4,
        type: "visual",
        title: "Hint 4: Mental Model & Visual Simulation",
        badge: "Hint 4 • Visual Intuition",
        content:
          "Imagine drawing each state on paper: elements as cells, pointers pointing to active items, and auxiliary memory as a scratchpad ledger. Watch how values shift from step to step.",
        bullets: [
          "Follow pointer movement across array elements.",
          "Inspect how variables update after each conditional branch.",
        ],
        keyTakeaway: "Click 'Launch Visualizer' to explore the step-by-step trace visually!",
      },
    ],
  };
}

export function getProblemHints(
  problemSlug: string,
  problemTitle: string = "",
  tags: string[] = [],
  language: string = "java"
): ProblemHints {
  const slug = (problemSlug || "").toLowerCase();
  const langKey = normalizeLanguage(language);

  if (curatedDefinitions[slug]) {
    const cur = curatedDefinitions[slug];
    const content = cur.step3.contentMap[langKey] || cur.step3.contentMap.java;
    const bullets = cur.step3.bulletsMap[langKey] || cur.step3.bulletsMap.java;
    const code = cur.step3.codeHints[langKey] || cur.step3.codeHints.java || "";

    return {
      problemSlug: cur.problemSlug,
      language: langKey,
      hints: [
        {
          step: 1,
          type: "little",
          title: cur.step1.title,
          badge: "Hint 1 • Initial Direction",
          content: cur.step1.content,
          bullets: cur.step1.bullets,
          keyTakeaway: cur.step1.keyTakeaway,
        },
        {
          step: 2,
          type: "more",
          title: cur.step2.title,
          badge: "Hint 2 • Key Insight",
          content: cur.step2.content,
          bullets: cur.step2.bullets,
          keyTakeaway: cur.step2.keyTakeaway,
        },
        {
          step: 3,
          type: "blueprint",
          title: cur.step3.title,
          badge: "Hint 3 • Solution Blueprint",
          content: content,
          bullets: bullets,
          codeHint: code,
          codeHints: cur.step3.codeHints,
          keyTakeaway: cur.step3.keyTakeaway,
        },
        {
          step: 4,
          type: "visual",
          title: cur.step4.title,
          badge: "Hint 4 • Visual Intuition",
          content: cur.step4.content,
          bullets: cur.step4.bullets,
          keyTakeaway: cur.step4.keyTakeaway,
        },
      ],
    };
  }

  return generateGenericHints(slug, problemTitle || "the problem", tags, langKey);
}
