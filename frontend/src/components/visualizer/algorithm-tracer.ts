/**
 * Katasphere Algorithm Execution Tracer
 * Generates step-by-step trace frames, pointer movements, data structure states,
 * and Big-O Time & Space complexity analyses for algorithms.
 */

export interface TracePointer {
  label: string;
  index: number;
  color?: string;
  description?: string;
}

export interface TraceArrayElement {
  index: number;
  value: string | number;
  state: "default" | "active" | "matched" | "checking" | "visited" | "pivot" | "swapped";
}

export interface TraceMapEntry {
  key: string | number;
  value: any;
  state?: "active" | "matched" | "normal";
}

export interface TraceStackItem {
  value: string | number;
  state?: "active" | "matched" | "popped";
}

export interface TraceFrame {
  stepIndex: number;
  totalSteps: number;
  title: string;
  explanation: string;
  codeLine?: string;
  phase: "init" | "iteration" | "check" | "found" | "done" | "update";
  variables: Record<string, string | number | boolean>;
  arrays: {
    name: string;
    elements: TraceArrayElement[];
    pointers: TracePointer[];
  }[];
  maps: {
    name: string;
    entries: TraceMapEntry[];
  }[];
  stacks: {
    name: string;
    items: TraceStackItem[];
  }[];
  metrics: {
    comparisons: number;
    operations: number;
    spaceUsed: number;
  };
}

export interface AlgorithmAnalysis {
  timeComplexity: string;
  timeComplexityName: string;
  timeExplanation: string;
  spaceComplexity: string;
  spaceComplexityName: string;
  spaceExplanation: string;
  approach: string;
  keyInsights: string[];
}

export interface TraceResult {
  frames: TraceFrame[];
  analysis: AlgorithmAnalysis;
  error?: string;
}

// -------------------------------------------------------------------------
// Helper input parsers
// -------------------------------------------------------------------------

/**
 * Extracts array of numbers from input string e.g. "nums = [2,7,11,15], target = 9"
 */
function extractArray(input: string, paramName: string = "nums"): number[] {
  try {
    const regex = new RegExp(`${paramName}\\s*=\\s*\\[([^\\]]*)\\]`, "i");
    const match = input.match(regex);
    if (match && match[1] !== undefined) {
      if (match[1].trim() === "") return [];
      return match[1].split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n));
    }

    // Fallback: look for any bracketed array
    const anyArrayMatch = input.match(/\[([0-9\s,-]+)\]/);
    if (anyArrayMatch && anyArrayMatch[1]) {
      return anyArrayMatch[1].split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n));
    }
  } catch {
    // fallback
  }
  return [2, 7, 11, 15];
}

/**
 * Extracts a target integer e.g. "target = 9"
 */
function extractNumber(input: string, paramName: string = "target", fallback: number = 9): number {
  try {
    const regex = new RegExp(`${paramName}\\s*=\\s*(-?\\d+)`, "i");
    const match = input.match(regex);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    const anyNumMatch = input.match(/=\s*(-?\d+)/);
    if (anyNumMatch && anyNumMatch[1]) {
      return parseInt(anyNumMatch[1], 10);
    }
  } catch {
    // fallback
  }
  return fallback;
}

/**
 * Extracts a string argument e.g. s = "()" or s = "abcabcbb"
 */
function extractString(input: string, paramName: string = "s", fallback: string = "()[]{}"): string {
  try {
    const regex = new RegExp(`${paramName}\\s*=\\s*["']([^"']*)["']`, "i");
    const match = input.match(regex);
    if (match && match[1] !== undefined) {
      return match[1];
    }
    const anyStr = input.match(/["']([^"']+)["']/);
    if (anyStr && anyStr[1]) {
      return anyStr[1];
    }
  } catch {
    // fallback
  }
  return fallback;
}

// -------------------------------------------------------------------------
// Code Analyzer for Big-O Complexity
// -------------------------------------------------------------------------

export function analyzeComplexity(code: string, problemSlug: string): AlgorithmAnalysis {
  const cleanCode = code.toLowerCase();

  // Detect data structures used
  const hasHashMap =
    cleanCode.includes("hashmap") ||
    cleanCode.includes("dict()") ||
    cleanCode.includes("{}") ||
    cleanCode.includes("new map") ||
    cleanCode.includes("unordered_map");
  const hasSet =
    cleanCode.includes("hashset") ||
    cleanCode.includes("set()") ||
    cleanCode.includes("new set") ||
    cleanCode.includes("unordered_set");
  const hasStack =
    cleanCode.includes("stack") ||
    cleanCode.includes("append") && cleanCode.includes("pop()") ||
    cleanCode.includes("push(") && cleanCode.includes(".pop()");

  // Count loops to detect O(n^2) vs O(n)
  const forMatches = (cleanCode.match(/\bfor\b/g) || []).length;
  const whileMatches = (cleanCode.match(/\bwhile\b/g) || []).length;
  const totalLoops = forMatches + whileMatches;

  // Problem-specific analysis
  if (problemSlug === "two-sum") {
    if (hasHashMap || cleanCode.includes("prevmap") || cleanCode.includes("seen") || cleanCode.includes("lookup")) {
      return {
        timeComplexity: "O(n)",
        timeComplexityName: "Linear Time",
        timeExplanation:
          "Single pass through the array of length n. Hash table lookup and insertion operations run in O(1) amortized time.",
        spaceComplexity: "O(n)",
        spaceComplexityName: "Linear Auxiliary Space",
        spaceExplanation:
          "Stores at most n key-value pairs in the hash table to track complements.",
        approach: "One-pass Hash Table",
        keyInsights: [
          "Trading O(n) auxiliary space for O(n) optimal time.",
          "Target - current = complement lookup in O(1) time.",
          "Avoids the nested O(n²) loop brute force approach.",
        ],
      };
    } else {
      return {
        timeComplexity: "O(n²)",
        timeComplexityName: "Quadratic Time",
        timeExplanation:
          "Nested loops inspect all n * (n - 1) / 2 pairs in the array.",
        spaceComplexity: "O(1)",
        spaceComplexityName: "Constant Space",
        spaceExplanation:
          "No extra dynamic memory allocated beyond index pointer variables.",
        approach: "Brute Force Pair Check",
        keyInsights: [
          "Check every combination (i, j) where i < j.",
          "Simple to implement with zero extra space.",
          "Can be optimized to O(n) using a hash map.",
        ],
      };
    }
  }

  if (problemSlug === "best-time-to-buy-and-sell-stock") {
    return {
      timeComplexity: "O(n)",
      timeComplexityName: "Linear Time",
      timeExplanation:
        "Single pass through price points, greedily updating the minimum buy price and maximum profit seen so far.",
      spaceComplexity: "O(1)",
      spaceComplexityName: "Constant Space",
      spaceExplanation:
        "Only uses two scalar variables (`min_price` and `max_profit`) regardless of input array size.",
      approach: "One-pass Greedy / Kadane's Variant",
      keyInsights: [
        "Track the lowest price seen so far as you iterate.",
        "Calculate potential profit = current_price - min_price.",
        "Maintain running maximum profit in O(1) space.",
      ],
    };
  }

  if (problemSlug === "valid-parentheses") {
    return {
      timeComplexity: "O(n)",
      timeComplexityName: "Linear Time",
      timeExplanation:
        "Iterates through the string of length n once. Each character is pushed and popped at most once in O(1) time.",
      spaceComplexity: "O(n)",
      spaceComplexityName: "Linear Auxiliary Space",
      spaceExplanation:
        "In the worst case (e.g. '((((('), the stack stores all n characters.",
      approach: "LIFO Stack Matching",
      keyInsights: [
        "Last opened bracket must be the first one closed.",
        "Use a hash map to verify open-close bracket pairs.",
        "Stack must be empty at the end for a valid string.",
      ],
    };
  }

  if (problemSlug === "maximum-subarray") {
    return {
      timeComplexity: "O(n)",
      timeComplexityName: "Linear Time",
      timeExplanation:
        "Kadane's Algorithm makes a single pass through the array, updating the current running sum and global maximum.",
      spaceComplexity: "O(1)",
      spaceComplexityName: "Constant Space",
      spaceExplanation:
        "Only keeps two running numbers: `current_sum` and `max_sum`.",
      approach: "Kadane's Dynamic Programming Algorithm",
      keyInsights: [
        "If running sum drops below 0, reset it to 0 (discard negative prefix).",
        "Add current number and update global maximum.",
        "Guarantees optimal contiguous subarray sum in O(n) time.",
      ],
    };
  }

  if (problemSlug === "contains-duplicate") {
    if (hasSet || hasHashMap) {
      return {
        timeComplexity: "O(n)",
        timeComplexityName: "Linear Time",
        timeExplanation:
          "Single pass checking if element already exists in hash set in O(1) average time.",
        spaceComplexity: "O(n)",
        spaceComplexityName: "Linear Space",
        spaceExplanation:
          "In the worst case when all elements are unique, the hash set stores n elements.",
        approach: "Hash Set Lookup",
        keyInsights: [
          "Hash set provides instant O(1) membership checks.",
          "Early exit as soon as any duplicate element is encountered.",
        ],
      };
    }
  }

  if (problemSlug.includes("binary-search")) {
    return {
      timeComplexity: "O(log n)",
      timeComplexityName: "Logarithmic Time",
      timeExplanation:
        "Each comparison halves the search interval [left, right], reducing n to 1 in log₂(n) steps.",
      spaceComplexity: "O(1)",
      spaceComplexityName: "Constant Space",
      spaceExplanation:
        "Iterative binary search only stores three integer pointers: left, mid, and right.",
      approach: "Divide & Conquer Binary Search",
      keyInsights: [
        "Search space is cut in half at every iteration.",
        "Calculate `mid = left + (right - left) // 2` to prevent overflow.",
      ],
    };
  }

  if (problemSlug === "3sum") {
    return {
      timeComplexity: "O(n²)",
      timeComplexityName: "Quadratic Time",
      timeExplanation:
        "Sorting takes O(n log n). Outer loop runs n times, and the inner two-pointer search takes O(n). Total is O(n²).",
      spaceComplexity: "O(1) or O(n)",
      spaceComplexityName: "Constant to Linear Space",
      spaceExplanation:
        "O(1) extra space beyond sorting overhead and output list of triplets.",
      approach: "Sort + Two Pointers",
      keyInsights: [
        "Sort array first so duplicates can be skipped easily.",
        "Fix the first element, then solve Two Sum on remaining slice with two pointers.",
      ],
    };
  }

  // Generic fallback based on loop and data structure count
  if (totalLoops >= 2) {
    return {
      timeComplexity: "O(n²)",
      timeComplexityName: "Quadratic Time",
      timeExplanation:
        "Contains nested loop iterations resulting in n * n maximum operations.",
      spaceComplexity: hasHashMap || hasSet ? "O(n)" : "O(1)",
      spaceComplexityName: hasHashMap || hasSet ? "Linear Auxiliary Space" : "Constant Space",
      spaceExplanation:
        hasHashMap || hasSet
          ? "Allocates dynamic hash table/set proportional to input size."
          : "Stores pointers and primitive scalars only.",
      approach: "Nested Iteration Analysis",
      keyInsights: [
        "Outer loop controls candidate elements; inner loop verifies conditions.",
        "Consider caching or two-pointer techniques to optimize toward O(n).",
      ],
    };
  }

  return {
    timeComplexity: "O(n)",
    timeComplexityName: "Linear Time",
    timeExplanation:
      "Performs a single linear pass or constant number of operations per element in the input.",
    spaceComplexity: hasHashMap || hasSet || hasStack ? "O(n)" : "O(1)",
    spaceComplexityName: hasHashMap || hasSet || hasStack ? "Linear Space" : "Constant Space",
    spaceExplanation:
      hasHashMap || hasSet || hasStack
        ? "Uses auxiliary data structure storing elements."
        : "Operates with constant O(1) auxiliary variables.",
    approach: "Linear Scan / Pointer Technique",
    keyInsights: [
      "Process each element in sequential order.",
      "Optimal for single-pass data structure algorithms.",
    ],
  };
}

// -------------------------------------------------------------------------
// Tracer Implementations for Core Patterns
// -------------------------------------------------------------------------

/**
 * Two Sum Tracer
 */
function traceTwoSum(nums: number[], target: number): TraceFrame[] {
  const frames: TraceFrame[] = [];
  const map: Record<number, number> = {};
  let comparisons = 0;
  let operations = 0;

  // Frame 0: Initialization
  frames.push({
    stepIndex: 1,
    totalSteps: 1, // updated at end
    title: "Initialize Hash Map & Pointers",
    explanation: `Target is ${target}. We will iterate through nums = [${nums.join(
      ", "
    )}] and use a Hash Map to find if the complement (target - num) was previously seen in O(1) time.`,
    codeLine: "prevMap = {} # val -> index",
    phase: "init",
    variables: { target, "nums.length": nums.length },
    arrays: [
      {
        name: "nums",
        elements: nums.map((v, i) => ({ index: i, value: v, state: "default" })),
        pointers: [],
      },
    ],
    maps: [{ name: "prevMap", entries: [] }],
    stacks: [],
    metrics: { comparisons: 0, operations: 1, spaceUsed: 0 },
  });

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const complement = target - num;
    comparisons++;
    operations++;

    // Step A: Inspect element and calculate complement
    const mapEntries = Object.entries(map).map(([k, v]) => ({
      key: Number(k),
      value: v,
      state: "normal" as const,
    }));

    frames.push({
      stepIndex: frames.length + 1,
      totalSteps: 1,
      title: `Inspect Index ${i}: nums[${i}] = ${num}`,
      explanation: `Looking at nums[${i}] = ${num}. Complement needed is: target (${target}) - nums[${i}] (${num}) = ${complement}. Checking if ${complement} is in prevMap.`,
      codeLine: `diff = target - num # ${target} - ${num} = ${complement}`,
      phase: "check",
      variables: {
        i,
        num,
        target,
        complement,
        "map.size": Object.keys(map).length,
      },
      arrays: [
        {
          name: "nums",
          elements: nums.map((v, idx) => ({
            index: idx,
            value: v,
            state: idx === i ? "active" : idx < i ? "visited" : "default",
          })),
          pointers: [{ label: `i = ${i}`, index: i, color: "#f59e0b" }],
        },
      ],
      maps: [{ name: "prevMap", entries: [...mapEntries] }],
      stacks: [],
      metrics: { comparisons, operations, spaceUsed: Object.keys(map).length },
    });

    if (complement in map) {
      const matchIdx = map[complement];
      operations++;

      // Found match!
      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `Match Found! [${matchIdx}, ${i}]`,
        explanation: `Found complement ${complement} in prevMap at index ${matchIdx}! Since nums[${matchIdx}] (${nums[matchIdx]}) + nums[${i}] (${num}) = ${target}, return indices [${matchIdx}, ${i}].`,
        codeLine: `return [prevMap[diff], i] # [${matchIdx}, ${i}]`,
        phase: "found",
        variables: {
          i,
          matchIdx,
          "nums[matchIdx]": nums[matchIdx],
          "nums[i]": num,
          sum: nums[matchIdx] + num,
        },
        arrays: [
          {
            name: "nums",
            elements: nums.map((v, idx) => ({
              index: idx,
              value: v,
              state: idx === matchIdx || idx === i ? "matched" : idx < i ? "visited" : "default",
            })),
            pointers: [
              { label: `match (${matchIdx})`, index: matchIdx, color: "#10b981" },
              { label: `i (${i})`, index: i, color: "#10b981" },
            ],
          },
        ],
        maps: [
          {
            name: "prevMap",
            entries: mapEntries.map((e) =>
              e.key === complement ? { ...e, state: "matched" as const } : e
            ),
          },
        ],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: Object.keys(map).length },
      });
      break;
    } else {
      // Not found, insert into map
      map[num] = i;
      operations++;

      const updatedMapEntries = Object.entries(map).map(([k, v]) => ({
        key: Number(k),
        value: v,
        state: Number(k) === num ? ("active" as const) : ("normal" as const),
      }));

      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `Store in Map: { ${num}: ${i} }`,
        explanation: `Complement ${complement} was NOT in prevMap. Store current value ${num} with its index ${i} so later numbers can match with it in O(1) time.`,
        codeLine: `prevMap[num] = i # { ${num}: ${i} }`,
        phase: "update",
        variables: {
          i,
          num,
          stored: `${num} -> ${i}`,
          "map.size": Object.keys(map).length,
        },
        arrays: [
          {
            name: "nums",
            elements: nums.map((v, idx) => ({
              index: idx,
              value: v,
              state: idx <= i ? "visited" : "default",
            })),
            pointers: [{ label: `i = ${i}`, index: i, color: "#94a3b8" }],
          },
        ],
        maps: [{ name: "prevMap", entries: updatedMapEntries }],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: Object.keys(map).length },
      });
    }
  }

  // Update totalSteps across all frames
  frames.forEach((f) => (f.totalSteps = frames.length));
  return frames;
}

/**
 * Best Time to Buy and Sell Stock Tracer
 */
function traceStock(prices: number[]): TraceFrame[] {
  const frames: TraceFrame[] = [];
  let minPrice = prices.length > 0 ? prices[0] : 0;
  let minPriceIdx = 0;
  let maxProfit = 0;
  let bestBuyIdx = 0;
  let bestSellIdx = 0;
  let comparisons = 0;
  let operations = 0;

  // Frame 0: Init
  frames.push({
    stepIndex: 1,
    totalSteps: 1,
    title: "Initialize Stock Tracking",
    explanation: `Track the lowest buy price seen so far and the maximum profit possible. Starting with day 0 price $${prices[0]}.`,
    codeLine: "min_price = prices[0]; max_profit = 0",
    phase: "init",
    variables: { minPrice, maxProfit, currentDay: 0 },
    arrays: [
      {
        name: "prices",
        elements: prices.map((p, i) => ({
          index: i,
          value: `$${p}`,
          state: i === 0 ? "active" : "default",
        })),
        pointers: [{ label: `minPrice ($${minPrice})`, index: 0, color: "#06b6d4" }],
      },
    ],
    maps: [],
    stacks: [],
    metrics: { comparisons: 0, operations: 1, spaceUsed: 2 },
  });

  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];
    comparisons++;
    operations++;

    if (currentPrice < minPrice) {
      minPrice = currentPrice;
      minPriceIdx = i;

      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `Day ${i}: New Lowest Price Found ($${currentPrice})`,
        explanation: `Today's price $${currentPrice} is cheaper than previous min price. Updating minPrice = $${currentPrice} (best day to buy so far).`,
        codeLine: `min_price = min(min_price, price) # $${currentPrice}`,
        phase: "update",
        variables: { currentDay: i, currentPrice: `$${currentPrice}`, minPrice: `$${minPrice}`, maxProfit: `$${maxProfit}` },
        arrays: [
          {
            name: "prices",
            elements: prices.map((p, idx) => ({
              index: idx,
              value: `$${p}`,
              state: idx === i ? "pivot" : idx === bestBuyIdx ? "active" : idx < i ? "visited" : "default",
            })),
            pointers: [
              { label: `Buy Candidate ($${minPrice})`, index: i, color: "#06b6d4" },
              { label: `Day ${i}`, index: i, color: "#f59e0b" },
            ],
          },
        ],
        maps: [],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: 2 },
      });
    } else {
      const profit = currentPrice - minPrice;
      comparisons++;

      if (profit > maxProfit) {
        maxProfit = profit;
        bestBuyIdx = minPriceIdx;
        bestSellIdx = i;

        frames.push({
          stepIndex: frames.length + 1,
          totalSteps: 1,
          title: `Day ${i}: New Maximum Profit ($${maxProfit})`,
          explanation: `Selling today at $${currentPrice} bought at $${minPrice} gives profit: $${currentPrice} - $${minPrice} = $${profit}. This beats our previous max profit!`,
          codeLine: `max_profit = max(max_profit, price - min_price) # $${maxProfit}`,
          phase: "found",
          variables: {
            buyDay: bestBuyIdx,
            buyPrice: `$${minPrice}`,
            sellDay: i,
            sellPrice: `$${currentPrice}`,
            currentProfit: `$${profit}`,
            maxProfit: `$${maxProfit}`,
          },
          arrays: [
            {
              name: "prices",
              elements: prices.map((p, idx) => ({
                index: idx,
                value: `$${p}`,
                state: idx === bestBuyIdx || idx === bestSellIdx ? "matched" : idx < i ? "visited" : "default",
              })),
              pointers: [
                { label: `Buy ($${minPrice})`, index: bestBuyIdx, color: "#10b981" },
                { label: `Sell ($${currentPrice})`, index: bestSellIdx, color: "#10b981" },
              ],
            },
          ],
          maps: [],
          stacks: [],
          metrics: { comparisons, operations, spaceUsed: 2 },
        });
      } else {
        frames.push({
          stepIndex: frames.length + 1,
          totalSteps: 1,
          title: `Day ${i}: Check Profit ($${profit})`,
          explanation: `Selling today at $${currentPrice} (bought at $${minPrice}) gives profit $${profit}, which does not exceed current max profit $${maxProfit}.`,
          codeLine: `profit = price - min_price # $${profit} <= $${maxProfit}`,
          phase: "iteration",
          variables: { currentPrice: `$${currentPrice}`, minPrice: `$${minPrice}`, profit: `$${profit}`, maxProfit: `$${maxProfit}` },
          arrays: [
            {
              name: "prices",
              elements: prices.map((p, idx) => ({
                index: idx,
                value: `$${p}`,
                state: idx === i ? "active" : idx < i ? "visited" : "default",
              })),
              pointers: [
                { label: `min ($${minPrice})`, index: minPriceIdx, color: "#06b6d4" },
                { label: `day ${i}`, index: i, color: "#f59e0b" },
              ],
            },
          ],
          maps: [],
          stacks: [],
          metrics: { comparisons, operations, spaceUsed: 2 },
        });
      }
    }
  }

  // Final summary frame
  frames.push({
    stepIndex: frames.length + 1,
    totalSteps: 1,
    title: `Execution Complete: Maximum Profit = $${maxProfit}`,
    explanation:
      maxProfit > 0
        ? `Best strategy: Buy on Day ${bestBuyIdx} at $${prices[bestBuyIdx]}, and sell on Day ${bestSellIdx} at $${prices[bestSellIdx]} for maximum profit of $${maxProfit}.`
        : "No profitable transactions possible (prices continually decrease). Return 0.",
    codeLine: `return max_profit # $${maxProfit}`,
    phase: "done",
    variables: { maxProfit: `$${maxProfit}`, totalDays: prices.length },
    arrays: [
      {
        name: "prices",
        elements: prices.map((p, idx) => ({
          index: idx,
          value: `$${p}`,
          state:
            maxProfit > 0 && (idx === bestBuyIdx || idx === bestSellIdx)
              ? "matched"
              : "visited",
        })),
        pointers:
          maxProfit > 0
            ? [
                { label: `Best Buy ($${prices[bestBuyIdx]})`, index: bestBuyIdx, color: "#10b981" },
                { label: `Best Sell ($${prices[bestSellIdx]})`, index: bestSellIdx, color: "#10b981" },
              ]
            : [],
      },
    ],
    maps: [],
    stacks: [],
    metrics: { comparisons, operations, spaceUsed: 2 },
  });

  frames.forEach((f) => (f.totalSteps = frames.length));
  return frames;
}

/**
 * Valid Parentheses Tracer
 */
function traceParentheses(s: string): TraceFrame[] {
  const frames: TraceFrame[] = [];
  const stack: string[] = [];
  const map: Record<string, string> = { ")": "(", "}": "{", "]": "[" };
  const chars = s.split("");
  let comparisons = 0;
  let operations = 0;
  let isValid = true;

  // Frame 0: Init
  frames.push({
    stepIndex: 1,
    totalSteps: 1,
    title: "Initialize Stack",
    explanation: `We will process brackets in string "${s}" using a LIFO Stack. Open brackets '(', '{', '[' get pushed; closing brackets ')', '}', ']' must match and pop the top element.`,
    codeLine: "stack = []\npairs = { ')': '(', '}': '{', ']': '[' }",
    phase: "init",
    variables: { stringLength: s.length, "stack.length": 0 },
    arrays: [
      {
        name: "characters",
        elements: chars.map((c, i) => ({ index: i, value: c, state: "default" })),
        pointers: [],
      },
    ],
    maps: [],
    stacks: [{ name: "bracketStack", items: [] }],
    metrics: { comparisons: 0, operations: 1, spaceUsed: 0 },
  });

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    comparisons++;
    operations++;

    if (ch === "(" || ch === "{" || ch === "[") {
      stack.push(ch);
      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `Index ${i}: Push '${ch}' to Stack`,
        explanation: `'${ch}' is an open bracket. Push it onto the stack. Current stack depth: ${stack.length}.`,
        codeLine: `stack.append('${ch}')`,
        phase: "iteration",
        variables: { currentIndex: i, char: ch, stackTop: ch, stackDepth: stack.length },
        arrays: [
          {
            name: "characters",
            elements: chars.map((c, idx) => ({
              index: idx,
              value: c,
              state: idx === i ? "active" : idx < i ? "visited" : "default",
            })),
            pointers: [{ label: `i = ${i}`, index: i, color: "#3b82f6" }],
          },
        ],
        maps: [],
        stacks: [
          {
            name: "bracketStack",
            items: stack.map((item, idx) => ({
              value: item,
              state: idx === stack.length - 1 ? ("active" as const) : undefined,
            })),
          },
        ],
        metrics: { comparisons, operations, spaceUsed: stack.length },
      });
    } else {
      // Closing bracket
      const top = stack.pop();
      const expected = map[ch];
      const matched = top === expected;

      if (!matched) {
        isValid = false;
        frames.push({
          stepIndex: frames.length + 1,
          totalSteps: 1,
          title: `Index ${i}: Mismatched Bracket '${ch}'!`,
          explanation: `Found closing bracket '${ch}', which requires '${expected}'. But top of stack was '${top || "EMPTY"}'. Mismatch detected! String is INVALID.`,
          codeLine: `if not stack or stack.pop() != pairs[c]: return False`,
          phase: "done",
          variables: { currentIndex: i, closingChar: ch, required: expected, topFound: top || "none", isValid: false },
          arrays: [
            {
              name: "characters",
              elements: chars.map((c, idx) => ({
                index: idx,
                value: c,
                state: idx === i ? "pivot" : idx < i ? "visited" : "default",
              })),
              pointers: [{ label: `Mismatch!`, index: i, color: "#ef4444" }],
            },
          ],
          maps: [],
          stacks: [
            {
              name: "bracketStack",
              items: stack.map((item) => ({ value: item })),
            },
          ],
          metrics: { comparisons, operations, spaceUsed: stack.length },
        });
        break;
      } else {
        frames.push({
          stepIndex: frames.length + 1,
          totalSteps: 1,
          title: `Index ${i}: Match & Pop '${top}' and '${ch}'`,
          explanation: `Closing bracket '${ch}' matches top bracket '${top}'. Successfully popped. Remaining stack depth: ${stack.length}.`,
          codeLine: `if stack.pop() == pairs['${ch}']: # Matched!`,
          phase: "check",
          variables: { currentIndex: i, matchedPair: `${top} ➔ ${ch}`, remainingStackDepth: stack.length },
          arrays: [
            {
              name: "characters",
              elements: chars.map((c, idx) => ({
                index: idx,
                value: c,
                state: idx === i ? "matched" : idx < i ? "visited" : "default",
              })),
              pointers: [{ label: `Matched '${ch}'`, index: i, color: "#10b981" }],
            },
          ],
          maps: [],
          stacks: [
            {
              name: "bracketStack",
              items: stack.map((item) => ({ value: item })),
            },
          ],
          metrics: { comparisons, operations, spaceUsed: stack.length },
        });
      }
    }
  }

  if (isValid) {
    const finalValid = stack.length === 0;
    frames.push({
      stepIndex: frames.length + 1,
      totalSteps: 1,
      title: finalValid ? "Valid Parentheses: Result TRUE" : "Unclosed Brackets: Result FALSE",
      explanation: finalValid
        ? "All brackets were matched and closed in proper order. The stack is empty. String is VALID."
        : `String reached end but ${stack.length} open bracket(s) remain on stack without closing. String is INVALID.`,
      codeLine: "return len(stack) == 0",
      phase: finalValid ? "found" : "done",
      variables: { isValid: finalValid, remainingUnclosed: stack.length },
      arrays: [
        {
          name: "characters",
          elements: chars.map((c) => ({
            index: 0,
            value: c,
            state: finalValid ? "matched" : "pivot",
          })),
          pointers: [],
        },
      ],
      maps: [],
      stacks: [{ name: "bracketStack", items: stack.map((s) => ({ value: s })) }],
      metrics: { comparisons, operations, spaceUsed: stack.length },
    });
  }

  frames.forEach((f) => (f.totalSteps = frames.length));
  return frames;
}

/**
 * Kadane's Maximum Subarray Tracer
 */
function traceMaximumSubarray(nums: number[]): TraceFrame[] {
  const frames: TraceFrame[] = [];
  let currentSum = nums[0];
  let maxSum = nums[0];
  let bestStart = 0;
  let bestEnd = 0;
  let currStart = 0;
  let comparisons = 0;
  let operations = 0;

  // Frame 0: Init
  frames.push({
    stepIndex: 1,
    totalSteps: 1,
    title: "Initialize Kadane's Algorithm",
    explanation: `We will find the contiguous subarray with the largest sum. Starting with nums[0] = ${nums[0]}. If current sum drops below 0, we discard the negative prefix.`,
    codeLine: "max_sum = current_sum = nums[0]",
    phase: "init",
    variables: { currentSum, maxSum, i: 0 },
    arrays: [
      {
        name: "nums",
        elements: nums.map((v, i) => ({
          index: i,
          value: v,
          state: i === 0 ? "active" : "default",
        })),
        pointers: [{ label: `nums[0] = ${nums[0]}`, index: 0, color: "#3b82f6" }],
      },
    ],
    maps: [],
    stacks: [],
    metrics: { comparisons: 0, operations: 1, spaceUsed: 2 },
  });

  for (let i = 1; i < nums.length; i++) {
    const val = nums[i];
    comparisons++;
    operations++;

    if (currentSum < 0) {
      currentSum = val;
      currStart = i;
      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `Index ${i}: Discard Negative Prefix, Restart at ${val}`,
        explanation: `Previous running sum was negative (${currentSum < 0 ? "< 0" : ""}). Continuing it would hurt any future sum. Discarding prefix and restarting subarray from index ${i} with value ${val}.`,
        codeLine: `current_sum = max(num, current_sum + num) # Reset to ${val}`,
        phase: "update",
        variables: { i, val, currentSum, maxSum },
        arrays: [
          {
            name: "nums",
            elements: nums.map((v, idx) => ({
              index: idx,
              value: v,
              state: idx === i ? "active" : idx >= bestStart && idx <= bestEnd ? "matched" : idx < i ? "visited" : "default",
            })),
            pointers: [{ label: `Restart (${val})`, index: i, color: "#f59e0b" }],
          },
        ],
        maps: [],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: 2 },
      });
    } else {
      currentSum += val;
      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `Index ${i}: Extend Subarray by ${val} (Sum = ${currentSum})`,
        explanation: `Adding nums[${i}] (${val}) to positive running sum. New current_sum = ${currentSum}.`,
        codeLine: `current_sum += num # ${currentSum}`,
        phase: "iteration",
        variables: { i, val, currentSum, maxSum },
        arrays: [
          {
            name: "nums",
            elements: nums.map((v, idx) => ({
              index: idx,
              value: v,
              state: idx >= currStart && idx <= i ? "active" : idx < i ? "visited" : "default",
            })),
            pointers: [{ label: `i = ${i}`, index: i, color: "#3b82f6" }],
          },
        ],
        maps: [],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: 2 },
      });
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      bestStart = currStart;
      bestEnd = i;

      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `New Maximum Subarray Sum: ${maxSum}!`,
        explanation: `current_sum (${currentSum}) exceeds max_sum (${maxSum}). Updating max_sum = ${maxSum}. Contiguous range: nums[${bestStart}..${bestEnd}].`,
        codeLine: `max_sum = max(max_sum, current_sum) # ${maxSum}`,
        phase: "found",
        variables: { i, bestStart, bestEnd, currentSum, maxSum },
        arrays: [
          {
            name: "nums",
            elements: nums.map((v, idx) => ({
              index: idx,
              value: v,
              state: idx >= bestStart && idx <= bestEnd ? "matched" : idx <= i ? "visited" : "default",
            })),
            pointers: [
              { label: `Start [${bestStart}]`, index: bestStart, color: "#10b981" },
              { label: `End [${bestEnd}]`, index: bestEnd, color: "#10b981" },
            ],
          },
        ],
        maps: [],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: 2 },
      });
    }
  }

  // Summary Frame
  frames.push({
    stepIndex: frames.length + 1,
    totalSteps: 1,
    title: `Kadane's Algorithm Done: Max Sum = ${maxSum}`,
    explanation: `Largest sum contiguous subarray is [${nums
      .slice(bestStart, bestEnd + 1)
      .join(", ")}] spanning indices ${bestStart} to ${bestEnd} with total sum = ${maxSum}.`,
    codeLine: `return max_sum # ${maxSum}`,
    phase: "done",
    variables: { maxSum, subarray: `[${nums.slice(bestStart, bestEnd + 1).join(", ")}]` },
    arrays: [
      {
        name: "nums",
        elements: nums.map((v, idx) => ({
          index: idx,
          value: v,
          state: idx >= bestStart && idx <= bestEnd ? "matched" : "visited",
        })),
        pointers: [
          { label: `Max Subarray Start`, index: bestStart, color: "#10b981" },
          { label: `Max Subarray End`, index: bestEnd, color: "#10b981" },
        ],
      },
    ],
    maps: [],
    stacks: [],
    metrics: { comparisons, operations, spaceUsed: 2 },
  });

  frames.forEach((f) => (f.totalSteps = frames.length));
  return frames;
}

/**
 * Binary Search Tracer
 */
function traceBinarySearch(nums: number[], target: number): TraceFrame[] {
  const frames: TraceFrame[] = [];
  let left = 0;
  let right = nums.length - 1;
  let found = false;
  let comparisons = 0;
  let operations = 0;

  frames.push({
    stepIndex: 1,
    totalSteps: 1,
    title: "Initialize Binary Search Pointers",
    explanation: `Searching for target = ${target} in sorted array of length ${nums.length}. left pointer = 0, right pointer = ${right}. Search interval contains ${nums.length} elements.`,
    codeLine: `left, right = 0, len(nums) - 1`,
    phase: "init",
    variables: { left, right, target, windowSize: right - left + 1 },
    arrays: [
      {
        name: "nums (sorted)",
        elements: nums.map((v, i) => ({ index: i, value: v, state: "default" })),
        pointers: [
          { label: "left (0)", index: left, color: "#3b82f6" },
          { label: `right (${right})`, index: right, color: "#ec4899" },
        ],
      },
    ],
    maps: [],
    stacks: [],
    metrics: { comparisons: 0, operations: 1, spaceUsed: 3 },
  });

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    const midVal = nums[mid];
    comparisons++;
    operations++;

    frames.push({
      stepIndex: frames.length + 1,
      totalSteps: 1,
      title: `Inspect Middle Element: nums[${mid}] = ${midVal}`,
      explanation: `Calculate mid = left + (right - left) // 2 = ${mid}. Comparing nums[${mid}] (${midVal}) with target (${target}). Current interval: [${left}..${right}] (${right - left + 1} elements).`,
      codeLine: `mid = (left + right) // 2\nif nums[mid] == target:`,
      phase: "check",
      variables: { left, mid, right, midVal, target },
      arrays: [
        {
          name: "nums (sorted)",
          elements: nums.map((v, i) => ({
            index: i,
            value: v,
            state: i === mid ? "pivot" : i >= left && i <= right ? "active" : "visited",
          })),
          pointers: [
            { label: `left (${left})`, index: left, color: "#3b82f6" },
            { label: `mid (${mid})`, index: mid, color: "#f59e0b" },
            { label: `right (${right})`, index: right, color: "#ec4899" },
          ],
        },
      ],
      maps: [],
      stacks: [],
      metrics: { comparisons, operations, spaceUsed: 3 },
    });

    if (midVal === target) {
      found = true;
      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `Target Found at Index ${mid}!`,
        explanation: `nums[${mid}] == target (${target}). Search succeeded in O(log n) time! Return index ${mid}.`,
        codeLine: `return mid # Found at index ${mid}`,
        phase: "found",
        variables: { target, resultIndex: mid, totalComparisons: comparisons },
        arrays: [
          {
            name: "nums (sorted)",
            elements: nums.map((v, i) => ({
              index: i,
              value: v,
              state: i === mid ? "matched" : "visited",
            })),
            pointers: [{ label: `FOUND [${mid}]`, index: mid, color: "#10b981" }],
          },
        ],
        maps: [],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: 3 },
      });
      break;
    } else if (midVal < target) {
      left = mid + 1;
      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `nums[${mid}] (${midVal}) < target (${target}): Discard Left Half`,
        explanation: `Since array is sorted and nums[${mid}] is smaller than ${target}, target must lie in the right half. Update left = mid + 1 = ${left}.`,
        codeLine: `left = mid + 1 # ${left}`,
        phase: "update",
        variables: { newLeft: left, right, target },
        arrays: [
          {
            name: "nums (sorted)",
            elements: nums.map((v, i) => ({
              index: i,
              value: v,
              state: i >= left && i <= right ? "active" : "visited",
            })),
            pointers: [
              { label: `left (${left})`, index: Math.min(left, nums.length - 1), color: "#3b82f6" },
              { label: `right (${right})`, index: right, color: "#ec4899" },
            ],
          },
        ],
        maps: [],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: 3 },
      });
    } else {
      right = mid - 1;
      frames.push({
        stepIndex: frames.length + 1,
        totalSteps: 1,
        title: `nums[${mid}] (${midVal}) > target (${target}): Discard Right Half`,
        explanation: `Since array is sorted and nums[${mid}] is greater than ${target}, target must lie in the left half. Update right = mid - 1 = ${right}.`,
        codeLine: `right = mid - 1 # ${right}`,
        phase: "update",
        variables: { left, newRight: right, target },
        arrays: [
          {
            name: "nums (sorted)",
            elements: nums.map((v, i) => ({
              index: i,
              value: v,
              state: i >= left && i <= right ? "active" : "visited",
            })),
            pointers: [
              { label: `left (${left})`, index: left, color: "#3b82f6" },
              { label: `right (${right})`, index: Math.max(right, 0), color: "#ec4899" },
            ],
          },
        ],
        maps: [],
        stacks: [],
        metrics: { comparisons, operations, spaceUsed: 3 },
      });
    }
  }

  if (!found) {
    frames.push({
      stepIndex: frames.length + 1,
      totalSteps: 1,
      title: `Target ${target} Not Found in Array`,
      explanation: `left pointer (${left}) crossed right pointer (${right}). Target does not exist in array. Return -1.`,
      codeLine: `return -1 # Not found`,
      phase: "done",
      variables: { target, result: -1, totalComparisons: comparisons },
      arrays: [
        {
          name: "nums (sorted)",
          elements: nums.map((v, i) => ({ index: i, value: v, state: "visited" })),
          pointers: [],
        },
      ],
      maps: [],
      stacks: [],
      metrics: { comparisons, operations, spaceUsed: 3 },
    });
  }

  frames.forEach((f) => (f.totalSteps = frames.length));
  return frames;
}

/**
 * Generic Smart Array & Loop Tracer
 * Fallback for arbitrary problems and custom inputs
 */
function traceGeneric(nums: number[], code: string, inputRaw: string): TraceFrame[] {
  const frames: TraceFrame[] = [];
  const safeNums = nums.length > 0 ? nums : [1, 2, 3, 4, 5];
  let comparisons = 0;
  let operations = 0;

  // Frame 0: Init
  frames.push({
    stepIndex: 1,
    totalSteps: 1,
    title: "Start Algorithm Execution",
    explanation: `Loaded input: [${safeNums.join(", ")}]. Tracing array elements and variable states step-by-step.`,
    codeLine: "# Initializing variables and data structures",
    phase: "init",
    variables: { "array.length": safeNums.length, rawInput: inputRaw || "default" },
    arrays: [
      {
        name: "array",
        elements: safeNums.map((v, i) => ({ index: i, value: v, state: "default" })),
        pointers: [],
      },
    ],
    maps: [],
    stacks: [],
    metrics: { comparisons: 0, operations: 1, spaceUsed: safeNums.length },
  });

  for (let i = 0; i < safeNums.length; i++) {
    comparisons++;
    operations++;
    frames.push({
      stepIndex: frames.length + 1,
      totalSteps: 1,
      title: `Step ${i + 1}: Process Element array[${i}] = ${safeNums[i]}`,
      explanation: `Pointer index i = ${i}, current value is ${safeNums[i]}. Inspecting conditions and updating state.`,
      codeLine: `for i in range(len(array)): # current val = ${safeNums[i]}`,
      phase: "iteration",
      variables: { i, value: safeNums[i], processedCount: i + 1 },
      arrays: [
        {
          name: "array",
          elements: safeNums.map((v, idx) => ({
            index: idx,
            value: v,
            state: idx === i ? "active" : idx < i ? "visited" : "default",
          })),
          pointers: [{ label: `i = ${i}`, index: i, color: "#3b82f6" }],
        },
      ],
      maps: [],
      stacks: [],
      metrics: { comparisons, operations, spaceUsed: safeNums.length },
    });
  }

  // Done Frame
  frames.push({
    stepIndex: frames.length + 1,
    totalSteps: 1,
    title: "Algorithm Execution Finished",
    explanation: `Successfully iterated through all ${safeNums.length} elements. Total operations: ${operations}.`,
    codeLine: "return result",
    phase: "done",
    variables: { totalProcessed: safeNums.length, status: "complete" },
    arrays: [
      {
        name: "array",
        elements: safeNums.map((v, idx) => ({ index: idx, value: v, state: "matched" })),
        pointers: [],
      },
    ],
    maps: [],
    stacks: [],
    metrics: { comparisons, operations, spaceUsed: safeNums.length },
  });

  frames.forEach((f) => (f.totalSteps = frames.length));
  return frames;
}

// -------------------------------------------------------------------------
// Main Tracing Dispatcher
// -------------------------------------------------------------------------

export function generateExecutionTrace(
  problemSlug: string,
  code: string,
  rawInput: string,
  language: string = "PYTHON"
): TraceResult {
  const analysis = analyzeComplexity(code, problemSlug);

  try {
    const slug = (problemSlug || "").toLowerCase();

    // 1. Two Sum
    if (slug.includes("two-sum")) {
      const nums = extractArray(rawInput, "nums");
      const target = extractNumber(rawInput, "target", 9);
      const frames = traceTwoSum(nums, target);
      return { frames, analysis };
    }

    // 2. Best Time to Buy and Sell Stock
    if (slug.includes("stock") || slug.includes("buy-and-sell")) {
      const prices = extractArray(rawInput, "prices");
      const frames = traceStock(prices.length > 0 ? prices : [7, 1, 5, 3, 6, 4]);
      return { frames, analysis };
    }

    // 3. Valid Parentheses
    if (slug.includes("parenthes") || slug.includes("bracket")) {
      const s = extractString(rawInput, "s", "()[]{}");
      const frames = traceParentheses(s);
      return { frames, analysis };
    }

    // 4. Maximum Subarray
    if (slug.includes("maximum-subarray") || slug.includes("max-subarray") || slug.includes("kadane")) {
      const nums = extractArray(rawInput, "nums");
      const frames = traceMaximumSubarray(nums.length > 0 ? nums : [-2, 1, -3, 4, -1, 2, 1, -5, 4]);
      return { frames, analysis };
    }

    // 5. Binary Search
    if (slug.includes("binary-search") || slug.includes("search-insert")) {
      const nums = extractArray(rawInput, "nums");
      const target = extractNumber(rawInput, "target", 9);
      const sorted = [...(nums.length > 0 ? nums : [-1, 0, 3, 5, 9, 12])].sort((a, b) => a - b);
      const frames = traceBinarySearch(sorted, target);
      return { frames, analysis };
    }

    // 6. Generic Fallback
    const extractedNums = extractArray(rawInput, "nums");
    const frames = traceGeneric(extractedNums, code, rawInput);
    return { frames, analysis };
  } catch (err: any) {
    return {
      frames: [],
      analysis,
      error: err?.message || "Failed to generate execution trace.",
    };
  }
}
