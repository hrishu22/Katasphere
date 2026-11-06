/**
 * Progressive Hints Data Provider
 * Provides 4-step progressive hints for coding problems:
 * Step 1: Initial Direction (Hint 1)
 * Step 2: Key Observation & Data Structure (Hint 2)
 * Step 3: Algorithm Recipe / Blueprint (Detailed Logic)
 * Step 4: Visual Intuition ("How you can think of the solution")
 */

export interface ProblemHintStep {
  step: 1 | 2 | 3 | 4;
  type: "little" | "more" | "blueprint" | "visual";
  title: string;
  badge: string;
  content: string;
  bullets?: string[];
  codeHint?: string;
  keyTakeaway?: string;
}

export interface ProblemHints {
  problemSlug: string;
  hints: [ProblemHintStep, ProblemHintStep, ProblemHintStep, ProblemHintStep];
}

const curatedHints: Record<string, ProblemHints> = {
  "two-sum": {
    problemSlug: "two-sum",
    hints: [
      {
        step: 1,
        type: "little",
        title: "Hint 1: Avoid Redundant Scans",
        badge: "Hint 1 • Initial Direction",
        content:
          "A brute force solution would check every pair of numbers using nested loops, which takes O(n²) time. Can you avoid searching the entire array for the second number if you remember what you have already inspected?",
        bullets: [
          "Ask yourself: If you are at a number x, what exact value are you looking for?",
          "Can you keep a record of previously visited numbers as you iterate?",
        ],
        keyTakeaway: "Trade space for time: remember past elements instead of re-scanning.",
      },
      {
        step: 2,
        type: "more",
        title: "Hint 2: The Power of Complements",
        badge: "Hint 2 • Key Insight",
        content:
          "For any current number `num`, the exact complement you need to reach the target is `diff = target - num`.",
        bullets: [
          "Instead of searching forward in the array for `diff`, check if `diff` was already seen in a lookup table.",
          "What data structure provides instant O(1) average lookup time? A Hash Map (or dictionary).",
        ],
        keyTakeaway: "Target complement = `target - num`. Hash tables make lookups O(1).",
      },
      {
        step: 3,
        type: "blueprint",
        title: "Algorithm Blueprint: One-Pass Hash Table",
        badge: "Hint 3 • Deep Blueprint",
        content:
          "Initialize an empty Hash Map `prevMap = {}` mapping number value -> its index. Iterate through `nums` with index `i`:",
        bullets: [
          "1. Calculate `diff = target - nums[i]`.",
          "2. If `diff` is in `prevMap`, return `[prevMap[diff], i]`.",
          "3. Otherwise, store `prevMap[nums[i]] = i` and proceed to the next element.",
          "This achieves optimal O(n) time and O(n) auxiliary space.",
        ],
        codeHint: "diff = target - num\nif diff in prev_map:\n    return [prev_map[diff], i]\nprev_map[num] = i",
        keyTakeaway: "Store as you go. You will never match an element with itself.",
      },
      {
        step: 4,
        type: "visual",
        title: "Visualization Hint: How to Think of the Solution",
        badge: "Hint 4 • Visual Intuition",
        content:
          "Picture an array of boxes and a mental ledger on the right. As your pointer steps from left to right, you look into the ledger for the missing puzzle piece. If not there, write down what you just saw. As soon as a number finds its complement already written in the ledger, both indices match!",
        bullets: [
          "Pointer `i` moves forward one box at a time.",
          "The ledger (Hash Map) grows dynamically with `{ value: index }`.",
          "The moment a box requires a complement that is in the ledger, the search halts in O(1) time.",
        ],
        keyTakeaway: "Click 'Launch Visualizer' below to watch this exact memory simulation step-by-step!",
      },
    ],
  },

  "best-time-to-buy-and-sell-stock": {
    problemSlug: "best-time-to-buy-and-sell-stock",
    hints: [
      {
        step: 1,
        type: "little",
        title: "Hint 1: Chronological Ordering",
        badge: "Hint 1 • Initial Direction",
        content:
          "You must buy before you can sell! That means the buy day must strictly precede the sell day. Can you track the lowest price seen before the current day?",
        bullets: [
          "You do not need to compare every day against every future day (O(n²)).",
          "If you were to sell today, what is the best possible day in the past to have bought?",
        ],
        keyTakeaway: "To maximize profit today, you should have bought at the minimum price seen so far.",
      },
      {
        step: 2,
        type: "more",
        title: "Hint 2: Maintain Running Min & Max",
        badge: "Hint 2 • Key Insight",
        content:
          "You only need two scalar numbers as you scan through the prices from left to right:",
        bullets: [
          "1. `min_price`: The lowest price encountered from day 0 up to today.",
          "2. `max_profit`: The highest profit observed so far.",
          "No arrays, stacks, or hash maps are necessary — this requires O(1) constant auxiliary space.",
        ],
        keyTakeaway: "Greedy single-pass approach in O(n) time and O(1) space.",
      },
      {
        step: 3,
        type: "blueprint",
        title: "Hint 3: Single-Pass Greedy Blueprint",
        badge: "Hint 3 • Solution Blueprint",
        content:
          "Initialize `min_price = prices[0]` and `max_profit = 0`. For each price in `prices`:",
        bullets: [
          "1. If `price < min_price`, update `min_price = price` (found a cheaper buy opportunity).",
          "2. Else, calculate potential profit: `price - min_price`. If this profit > `max_profit`, update `max_profit`.",
          "3. After checking all prices, return `max_profit`.",
        ],
        codeHint: "min_price = prices[0]\nmax_profit = 0\nfor price in prices:\n    min_price = min(min_price, price)\n    max_profit = max(max_profit, price - min_price)\nreturn max_profit",
        keyTakeaway: "Greedily update the valley (min_price) and peak profit in one pass.",
      },
      {
        step: 4,
        type: "visual",
        title: "Hint 4: Mental Model & Visual Simulation",
        badge: "Hint 4 • Visual Intuition",
        content:
          "Visualize the stock price curve as rolling hills and valleys. Imagine holding a marker at the lowest valley seen so far. Every time the curve climbs higher than the valley, measure the vertical height difference (profit). If the curve dips below your valley marker, slide your marker down to the new lowest valley.",
        bullets: [
          "Valley pointer locks onto the historical minimum.",
          "Current pointer tests the profit margin at every subsequent point.",
        ],
        keyTakeaway: "Click 'Launch Visualizer' to see the valley and profit markers in real-time!",
      },
    ],
  },

  "valid-parentheses": {
    problemSlug: "valid-parentheses",
    hints: [
      {
        step: 1,
        type: "little",
        title: "Hint 1: Last In, First Out (LIFO)",
        badge: "Hint 1 • Initial Direction",
        content:
          "Notice the nesting structure of brackets: the bracket that was opened most recently must be closed before any earlier brackets can be closed (e.g. in `([{}])`, `{}` closes first, then `[]`, then `()`).",
        bullets: [
          "What classic data structure operates on Last-In, First-Out (LIFO) order?",
          "Can you push open brackets and pop them when you encounter their closing counterpart?",
        ],
        keyTakeaway: "LIFO matching naturally suggests using a Stack.",
      },
      {
        step: 2,
        type: "more",
        title: "Hint 2: Matching Pairs with a Map",
        badge: "Hint 2 • Key Insight",
        content:
          "Store the matching pairs in a hash map: `')': '(', '}': '{', ']': '['`.",
        bullets: [
          "Whenever you see an opening bracket `(`, `{`, `[`, push it onto the stack.",
          "Whenever you see a closing bracket, check if the stack is non-empty and whether the top element matches the closing bracket's opening partner.",
        ],
        keyTakeaway: "Stack stores open brackets; map validates closing brackets.",
      },
      {
        step: 3,
        type: "blueprint",
        title: "Hint 3: Stack Processing Blueprint",
        badge: "Hint 3 • Solution Blueprint",
        content:
          "Initialize an empty list/stack `stack = []`. Iterate through each character `c` in `s`:",
        bullets: [
          "1. If `c` is a closing bracket (in `pairs` map):",
          "   - If `stack` is empty OR `stack.pop() != pairs[c]`, return `False` (mismatch!).",
          "2. Else, push `c` onto `stack`.",
          "3. At the end, return `True` only if `stack` is completely empty (all opened brackets were closed).",
        ],
        codeHint: "stack = []\npairs = {')': '(', '}': '{', ']': '['}\nfor c in s:\n    if c in pairs:\n        if not stack or stack.pop() != pairs[c]:\n            return False\n    else:\n        stack.append(c)\nreturn len(stack) == 0",
        keyTakeaway: "Don't forget the final check: stack must be empty for complete closure.",
      },
      {
        step: 4,
        type: "visual",
        title: "Hint 4: Mental Model & Visual Simulation",
        badge: "Hint 4 • Visual Intuition",
        content:
          "Think of a cafeteria plate dispenser. Every open bracket is a plate stacked on top. A matching closing bracket lifts the top plate off. If an incoming closing bracket does not match the top plate, the tower topples (invalid!). If all plates are cleanly cleared at the end, the string is valid.",
        bullets: [
          "Stack grows upwards with open brackets.",
          "Closing brackets dissolve matching top items.",
        ],
        keyTakeaway: "Click 'Launch Visualizer' to watch the stack push and pop brackets live!",
      },
    ],
  },

  "maximum-subarray": {
    problemSlug: "maximum-subarray",
    hints: [
      {
        step: 1,
        type: "little",
        title: "Hint 1: Discarding Toxic Prefixes",
        badge: "Hint 1 • Initial Direction",
        content:
          "If the running sum of a contiguous subarray drops below 0, can adding it to any future number ever help increase the sum?",
        bullets: [
          "A negative prefix only reduces the potential of whatever comes after it.",
          "When should you abandon a running subarray and start fresh?",
        ],
        keyTakeaway: "Whenever running sum < 0, reset it to 0 and start a fresh subarray.",
      },
      {
        step: 2,
        type: "more",
        title: "Hint 2: Kadane's Local vs Global Maximum",
        badge: "Hint 2 • Key Insight",
        content:
          "At each index `i`, you have two choices for `current_sum`:",
        bullets: [
          "1. Extend the existing subarray: `current_sum + nums[i]`.",
          "2. Start a new subarray beginning at `nums[i]` itself.",
          "Hence: `current_sum = max(nums[i], current_sum + nums[i])`.",
        ],
        keyTakeaway: "At each step, decide whether to continue the prefix or start over.",
      },
      {
        step: 3,
        type: "blueprint",
        title: "Hint 3: Kadane's Algorithm Blueprint",
        badge: "Hint 3 • Solution Blueprint",
        content:
          "Initialize `max_sum = current_sum = nums[0]`. Iterate through `nums` starting from index 1:",
        bullets: [
          "1. `current_sum = max(num, current_sum + num)`",
          "2. `max_sum = max(max_sum, current_sum)`",
          "3. Return `max_sum`.",
          "Runs in O(n) linear time with O(1) auxiliary memory.",
        ],
        codeHint: "max_sum = current_sum = nums[0]\nfor num in nums[1:]:\n    current_sum = max(num, current_sum + num)\n    max_sum = max(max_sum, current_sum)\nreturn max_sum",
        keyTakeaway: "Simple 4-line linear scan tracking running sum and peak sum.",
      },
      {
        step: 4,
        type: "visual",
        title: "Hint 4: Mental Model & Visual Simulation",
        badge: "Hint 4 • Visual Intuition",
        content:
          "Imagine walking along an elevation trail. If your elevation dips beneath sea level (negative sum), you are carrying dead weight — drop it and reset to zero. Keep a photo of the highest altitude you ever reached.",
        bullets: [
          "Sliding subarray window expands while sum stays healthy.",
          "Subarray window resets the moment it drags into negative territory.",
        ],
        keyTakeaway: "Click 'Launch Visualizer' to see the running sum and max subarray span animated!",
      },
    ],
  },
};

/**
 * Intelligent Fallback Generator for any problem
 */
function generateGenericHints(problemSlug: string, title: string, tags: string[] = []): ProblemHints {
  const isSearch = tags.some((t) => t.toLowerCase().includes("binary") || t.toLowerCase().includes("search"));
  const isTwoPointers = tags.some((t) => t.toLowerCase().includes("pointer"));
  const isDP = tags.some((t) => t.toLowerCase().includes("dynamic") || t.toLowerCase().includes("dp"));

  if (isSearch) {
    return {
      problemSlug,
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
            "Maintain two pointers `left` and `right`. In each step, calculate the midpoint `mid = left + (right - left) // 2` to safely avoid integer overflow.",
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
          content:
            "Set `left = 0, right = len(nums) - 1`. While `left <= right`:",
          bullets: [
            "Calculate `mid = (left + right) // 2`.",
            "If condition met, return `mid`.",
            "Adjust `left` or `right` accordingly.",
            "Return fallback (e.g. -1 or `left`) if search completes without match.",
          ],
          codeHint: "left, right = 0, len(nums) - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target: return mid\n    elif nums[mid] < target: left = mid + 1\n    else: right = mid - 1\nreturn -1",
          keyTakeaway: "Logarithmic O(log n) time and O(1) space.",
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
  return {
    problemSlug,
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
        content:
          "Structure your solution into three clean phases:",
        bullets: [
          "1. Initialization: Set up your base cases, pointers, or auxiliary cache.",
          "2. Main Loop: Iterate through the input, updating state according to your invariant.",
          "3. Output / Edge Handling: Return the collected result and verify constraints.",
        ],
        codeHint: "# 1. Initialize variables\n# 2. Iterate and update state\n# 3. Return final computed result",
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
  tags: string[] = []
): ProblemHints {
  const slug = (problemSlug || "").toLowerCase();
  if (curatedHints[slug]) {
    return curatedHints[slug];
  }
  return generateGenericHints(slug, problemTitle || "the problem", tags);
}
