export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: TagDto[];
  acceptanceRate: string;
}

export interface CompanySummary {
  name: string;
  slug: string;
  accentColor: string;
  description: string;
  interviewRounds: string;
  totalProblems: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  isPremium: boolean;
}

export const INITIAL_TAGS: TagDto[] = [
  {
    "id": "tag-leetcode",
    "name": "LeetCode",
    "slug": "leetcode"
  },
  {
    "id": "tag-geeksforgeeks",
    "name": "GeeksforGeeks",
    "slug": "geeksforgeeks"
  },
  {
    "id": "tag-blind-75",
    "name": "Blind 75",
    "slug": "blind-75"
  },
  {
    "id": "tag-sde-1",
    "name": "SDE 1",
    "slug": "sde-1"
  },
  {
    "id": "tag-google",
    "name": "Google",
    "slug": "google"
  },
  {
    "id": "tag-amazon",
    "name": "Amazon",
    "slug": "amazon"
  },
  {
    "id": "tag-meta",
    "name": "Meta",
    "slug": "meta"
  },
  {
    "id": "tag-microsoft",
    "name": "Microsoft",
    "slug": "microsoft"
  },
  {
    "id": "tag-apple",
    "name": "Apple",
    "slug": "apple"
  },
  {
    "id": "tag-uber",
    "name": "Uber",
    "slug": "uber"
  },
  {
    "id": "tag-bloomberg",
    "name": "Bloomberg",
    "slug": "bloomberg"
  },
  {
    "id": "tag-netflix",
    "name": "Netflix",
    "slug": "netflix"
  },
  {
    "id": "tag-array",
    "name": "Array",
    "slug": "array"
  },
  {
    "id": "tag-hash-table",
    "name": "Hash Table",
    "slug": "hash-table"
  },
  {
    "id": "tag-dynamic-programming",
    "name": "Dynamic Programming",
    "slug": "dynamic-programming"
  },
  {
    "id": "tag-stack",
    "name": "Stack",
    "slug": "stack"
  },
  {
    "id": "tag-string",
    "name": "String",
    "slug": "string"
  },
  {
    "id": "tag-two-pointers",
    "name": "Two Pointers",
    "slug": "two-pointers"
  },
  {
    "id": "tag-sliding-window",
    "name": "Sliding Window",
    "slug": "sliding-window"
  },
  {
    "id": "tag-greedy",
    "name": "Greedy",
    "slug": "greedy"
  },
  {
    "id": "tag-divide-and-conquer",
    "name": "Divide and Conquer",
    "slug": "divide-and-conquer"
  },
  {
    "id": "tag-math",
    "name": "Math",
    "slug": "math"
  },
  {
    "id": "tag-memoization",
    "name": "Memoization",
    "slug": "memoization"
  },
  {
    "id": "tag-sorting",
    "name": "Sorting",
    "slug": "sorting"
  },
  {
    "id": "tag-linked-list",
    "name": "Linked List",
    "slug": "linked-list"
  },
  {
    "id": "tag-recursion",
    "name": "Recursion",
    "slug": "recursion"
  },
  {
    "id": "tag-binary-tree",
    "name": "Binary Tree",
    "slug": "binary-tree"
  },
  {
    "id": "tag-breadth-first-search",
    "name": "Breadth-First Search",
    "slug": "breadth-first-search"
  },
  {
    "id": "tag-tree",
    "name": "Tree",
    "slug": "tree"
  },
  {
    "id": "tag-heap",
    "name": "Heap",
    "slug": "heap"
  },
  {
    "id": "tag-quickselect",
    "name": "Quickselect",
    "slug": "quickselect"
  },
  {
    "id": "tag-prefix-sum",
    "name": "Prefix Sum",
    "slug": "prefix-sum"
  },
  {
    "id": "tag-binary-search",
    "name": "Binary Search",
    "slug": "binary-search"
  },
  {
    "id": "tag-intervals",
    "name": "Intervals",
    "slug": "intervals"
  },
  {
    "id": "tag-trie",
    "name": "Trie",
    "slug": "trie"
  },
  {
    "id": "tag-depth-first-search",
    "name": "Depth-First Search",
    "slug": "depth-first-search"
  },
  {
    "id": "tag-union-find",
    "name": "Union Find",
    "slug": "union-find"
  },
  {
    "id": "tag-matrix",
    "name": "Matrix",
    "slug": "matrix"
  },
  {
    "id": "tag-graph",
    "name": "Graph",
    "slug": "graph"
  },
  {
    "id": "tag-topological-sort",
    "name": "Topological Sort",
    "slug": "topological-sort"
  },
  {
    "id": "tag-design",
    "name": "Design",
    "slug": "design"
  },
  {
    "id": "tag-doubly-linked-list",
    "name": "Doubly-Linked List",
    "slug": "doubly-linked-list"
  },
  {
    "id": "tag-merge-sort",
    "name": "Merge Sort",
    "slug": "merge-sort"
  },
  {
    "id": "tag-bucket-sort",
    "name": "Bucket Sort",
    "slug": "bucket-sort"
  },
  {
    "id": "tag-binary-search-tree",
    "name": "Binary Search Tree",
    "slug": "binary-search-tree"
  },
  {
    "id": "tag-bit-manipulation",
    "name": "Bit Manipulation",
    "slug": "bit-manipulation"
  },
  {
    "id": "tag-backtracking",
    "name": "Backtracking",
    "slug": "backtracking"
  },
  {
    "id": "tag-combinatorics",
    "name": "Combinatorics",
    "slug": "combinatorics"
  },
  {
    "id": "tag-simulation",
    "name": "Simulation",
    "slug": "simulation"
  },
  {
    "id": "tag-string-matching",
    "name": "String Matching",
    "slug": "string-matching"
  },
  {
    "id": "tag-hash-function",
    "name": "Hash Function",
    "slug": "hash-function"
  },
  {
    "id": "tag-data-stream",
    "name": "Data Stream",
    "slug": "data-stream"
  }
];

export const INITIAL_COMPANIES: CompanySummary[] = [
  {
    "name": "Google",
    "slug": "google",
    "accentColor": "#4285F4",
    "description": "Deep focus on graphs, DP, trees, and optimization rounds.",
    "interviewRounds": "5-6 Rounds (OA + 4 DSA + Googlyness)",
    "totalProblems": 47,
    "easyCount": 7,
    "mediumCount": 33,
    "hardCount": 7,
    "isPremium": true
  },
  {
    "name": "Amazon",
    "slug": "amazon",
    "accentColor": "#FF9900",
    "description": "Heavy priority on Hash Tables, BFS/DFS, Heaps, and LP alignment.",
    "interviewRounds": "4-5 Rounds (OA + 3 DSA + Bar Raiser)",
    "totalProblems": 61,
    "easyCount": 14,
    "mediumCount": 39,
    "hardCount": 8,
    "isPremium": true
  },
  {
    "name": "Meta",
    "slug": "meta",
    "accentColor": "#0668E1",
    "description": "High-speed implementation speed, Two Pointers, Trees, and DP.",
    "interviewRounds": "4 Rounds (Screen + 2 Coding + Behavioral)",
    "totalProblems": 41,
    "easyCount": 7,
    "mediumCount": 29,
    "hardCount": 5,
    "isPremium": true
  },
  {
    "name": "Microsoft",
    "slug": "microsoft",
    "accentColor": "#00A4EF",
    "description": "Strings, Linked Lists, Trees, and practical system problem solving.",
    "interviewRounds": "4-5 Rounds (Screen + 3 Coding + AA)",
    "totalProblems": 35,
    "easyCount": 9,
    "mediumCount": 22,
    "hardCount": 4,
    "isPremium": true
  },
  {
    "name": "Apple",
    "slug": "apple",
    "accentColor": "#A2AAAD",
    "description": "Array manipulation, pointers, bit manipulation, and clean C++/Java.",
    "interviewRounds": "5 Rounds (Screen + 4 Technical)",
    "totalProblems": 17,
    "easyCount": 9,
    "mediumCount": 7,
    "hardCount": 1,
    "isPremium": true
  },
  {
    "name": "Uber",
    "slug": "uber",
    "accentColor": "#000000",
    "description": "Graphs, shortest paths, concurrency, and Trie search challenges.",
    "interviewRounds": "4-5 Rounds (OA + System + 2 DSA)",
    "totalProblems": 8,
    "easyCount": 2,
    "mediumCount": 4,
    "hardCount": 2,
    "isPremium": true
  },
  {
    "name": "Bloomberg",
    "slug": "bloomberg",
    "accentColor": "#BB0000",
    "description": "Strings, stacks, queues, and streaming financial logic.",
    "interviewRounds": "4 Rounds (Tech Screen + 2 Onsite + HR)",
    "totalProblems": 7,
    "easyCount": 1,
    "mediumCount": 6,
    "hardCount": 0,
    "isPremium": true
  },
  {
    "name": "Netflix",
    "slug": "netflix",
    "accentColor": "#E50914",
    "description": "Senior algorithmic rigor, system trade-offs, and culture interview.",
    "interviewRounds": "5 Rounds (Screen + 4 High-Bar Tech)",
    "totalProblems": 0,
    "easyCount": 0,
    "mediumCount": 0,
    "hardCount": 0,
    "isPremium": true
  }
];

export const INITIAL_PROBLEMS: ProblemSummary[] = [
  {
    "id": "prob-two-sum",
    "slug": "two-sum",
    "title": "Two Sum",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-best-time-to-buy-and-sell-stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-valid-parentheses",
    "slug": "valid-parentheses",
    "title": "Valid Parentheses",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-bloomberg",
        "name": "Bloomberg",
        "slug": "bloomberg"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-stack",
        "name": "Stack",
        "slug": "stack"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-valid-palindrome",
    "slug": "valid-palindrome",
    "title": "Valid Palindrome",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-longest-substring-without-repeating-characters",
    "slug": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-bloomberg",
        "name": "Bloomberg",
        "slug": "bloomberg"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-sliding-window",
        "name": "Sliding Window",
        "slug": "sliding-window"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-container-with-most-water",
    "slug": "container-with-most-water",
    "title": "Container With Most Water",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-greedy",
        "name": "Greedy",
        "slug": "greedy"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-maximum-subarray",
    "slug": "maximum-subarray",
    "title": "Maximum Subarray",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-divide-and-conquer",
        "name": "Divide and Conquer",
        "slug": "divide-and-conquer"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-climbing-stairs",
    "slug": "climbing-stairs",
    "title": "Climbing Stairs",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-math",
        "name": "Math",
        "slug": "math"
      },
      {
        "id": "tag-memoization",
        "name": "Memoization",
        "slug": "memoization"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-3sum",
    "slug": "3sum",
    "title": "3Sum",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-reverse-linked-list",
    "slug": "reverse-linked-list",
    "title": "Reverse Linked List",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-linked-list",
        "name": "Linked List",
        "slug": "linked-list"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-recursion",
        "name": "Recursion",
        "slug": "recursion"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-uber",
        "name": "Uber",
        "slug": "uber"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-merge-two-sorted-lists",
    "slug": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-linked-list",
        "name": "Linked List",
        "slug": "linked-list"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-invert-binary-tree",
    "slug": "invert-binary-tree",
    "title": "Invert Binary Tree",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-uber",
        "name": "Uber",
        "slug": "uber"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-binary-tree-level-order-traversal",
    "slug": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-bloomberg",
        "name": "Bloomberg",
        "slug": "bloomberg"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-kth-largest-element-in-an-array",
    "slug": "kth-largest-element-in-an-array",
    "title": "Kth Largest Element in an Array",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-divide-and-conquer",
        "name": "Divide and Conquer",
        "slug": "divide-and-conquer"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-heap",
        "name": "Heap",
        "slug": "heap"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-quickselect",
        "name": "Quickselect",
        "slug": "quickselect"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-uber",
        "name": "Uber",
        "slug": "uber"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-product-of-array-except-self",
    "slug": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-prefix-sum",
        "name": "Prefix Sum",
        "slug": "prefix-sum"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-group-anagrams",
    "slug": "group-anagrams",
    "title": "Group Anagrams",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-search-in-rotated-sorted-array",
    "slug": "search-in-rotated-sorted-array",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-binary-search",
        "name": "Binary Search",
        "slug": "binary-search"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-trapping-rain-water",
    "slug": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "difficulty": "HARD",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-stack",
        "name": "Stack",
        "slug": "stack"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "37%"
  },
  {
    "id": "prob-longest-palindromic-substring",
    "slug": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-subarray-sum-equals-k",
    "slug": "subarray-sum-equals-k",
    "title": "Subarray Sum Equals K",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-prefix-sum",
        "name": "Prefix Sum",
        "slug": "prefix-sum"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-merge-intervals",
    "slug": "merge-intervals",
    "title": "Merge Intervals",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-intervals",
        "name": "Intervals",
        "slug": "intervals"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-bloomberg",
        "name": "Bloomberg",
        "slug": "bloomberg"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-coin-change",
    "slug": "coin-change",
    "title": "Coin Change",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-word-break",
    "slug": "word-break",
    "title": "Word Break",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-trie",
        "name": "Trie",
        "slug": "trie"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-bloomberg",
        "name": "Bloomberg",
        "slug": "bloomberg"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-number-of-islands",
    "slug": "number-of-islands",
    "title": "Number of Islands",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-union-find",
        "name": "Union Find",
        "slug": "union-find"
      },
      {
        "id": "tag-matrix",
        "name": "Matrix",
        "slug": "matrix"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-bloomberg",
        "name": "Bloomberg",
        "slug": "bloomberg"
      },
      {
        "id": "tag-uber",
        "name": "Uber",
        "slug": "uber"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-course-schedule",
    "slug": "course-schedule",
    "title": "Course Schedule",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-graph",
        "name": "Graph",
        "slug": "graph"
      },
      {
        "id": "tag-topological-sort",
        "name": "Topological Sort",
        "slug": "topological-sort"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-lowest-common-ancestor-of-a-binary-tree",
    "slug": "lowest-common-ancestor-of-a-binary-tree",
    "title": "Lowest Common Ancestor of a Binary Tree",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-median-of-two-sorted-arrays",
    "slug": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "difficulty": "HARD",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-binary-search",
        "name": "Binary Search",
        "slug": "binary-search"
      },
      {
        "id": "tag-divide-and-conquer",
        "name": "Divide and Conquer",
        "slug": "divide-and-conquer"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "37%"
  },
  {
    "id": "prob-lru-cache",
    "slug": "lru-cache",
    "title": "LRU Cache",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-linked-list",
        "name": "Linked List",
        "slug": "linked-list"
      },
      {
        "id": "tag-design",
        "name": "Design",
        "slug": "design"
      },
      {
        "id": "tag-doubly-linked-list",
        "name": "Doubly-Linked List",
        "slug": "doubly-linked-list"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-bloomberg",
        "name": "Bloomberg",
        "slug": "bloomberg"
      },
      {
        "id": "tag-uber",
        "name": "Uber",
        "slug": "uber"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-find-minimum-in-rotated-sorted-array",
    "slug": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-binary-search",
        "name": "Binary Search",
        "slug": "binary-search"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-binary-tree-maximum-path-sum",
    "slug": "binary-tree-maximum-path-sum",
    "title": "Binary Tree Maximum Path Sum",
    "difficulty": "HARD",
    "tags": [
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "37%"
  },
  {
    "id": "prob-rotate-image",
    "slug": "rotate-image",
    "title": "Rotate Image",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-math",
        "name": "Math",
        "slug": "math"
      },
      {
        "id": "tag-matrix",
        "name": "Matrix",
        "slug": "matrix"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-merge-k-sorted-lists",
    "slug": "merge-k-sorted-lists",
    "title": "Merge k Sorted Lists",
    "difficulty": "HARD",
    "tags": [
      {
        "id": "tag-linked-list",
        "name": "Linked List",
        "slug": "linked-list"
      },
      {
        "id": "tag-divide-and-conquer",
        "name": "Divide and Conquer",
        "slug": "divide-and-conquer"
      },
      {
        "id": "tag-heap",
        "name": "Heap",
        "slug": "heap"
      },
      {
        "id": "tag-merge-sort",
        "name": "Merge Sort",
        "slug": "merge-sort"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-uber",
        "name": "Uber",
        "slug": "uber"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "37%"
  },
  {
    "id": "prob-valid-anagram",
    "slug": "valid-anagram",
    "title": "Valid Anagram",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-top-k-frequent-elements",
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-divide-and-conquer",
        "name": "Divide and Conquer",
        "slug": "divide-and-conquer"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-heap",
        "name": "Heap",
        "slug": "heap"
      },
      {
        "id": "tag-bucket-sort",
        "name": "Bucket Sort",
        "slug": "bucket-sort"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-jump-game",
    "slug": "jump-game",
    "title": "Jump Game",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-greedy",
        "name": "Greedy",
        "slug": "greedy"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-kth-smallest-element-in-a-bst",
    "slug": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element in a BST",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-binary-search-tree",
        "name": "Binary Search Tree",
        "slug": "binary-search-tree"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-uber",
        "name": "Uber",
        "slug": "uber"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-decode-ways",
    "slug": "decode-ways",
    "title": "Decode Ways",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-contains-duplicate",
    "slug": "contains-duplicate",
    "title": "Contains Duplicate",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-maximum-product-subarray",
    "slug": "maximum-product-subarray",
    "title": "Maximum Product Subarray",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-longest-consecutive-sequence",
    "slug": "longest-consecutive-sequence",
    "title": "Longest Consecutive Sequence",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-sum-of-two-integers",
    "slug": "sum-of-two-integers",
    "title": "Sum of Two Integers",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-bit-manipulation",
        "name": "Bit Manipulation",
        "slug": "bit-manipulation"
      },
      {
        "id": "tag-math",
        "name": "Math",
        "slug": "math"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-number-of-1-bits",
    "slug": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-bit-manipulation",
        "name": "Bit Manipulation",
        "slug": "bit-manipulation"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-counting-bits",
    "slug": "counting-bits",
    "title": "Counting Bits",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-bit-manipulation",
        "name": "Bit Manipulation",
        "slug": "bit-manipulation"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-missing-number",
    "slug": "missing-number",
    "title": "Missing Number",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-math",
        "name": "Math",
        "slug": "math"
      },
      {
        "id": "tag-bit-manipulation",
        "name": "Bit Manipulation",
        "slug": "bit-manipulation"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-reverse-bits",
    "slug": "reverse-bits",
    "title": "Reverse Bits",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-bit-manipulation",
        "name": "Bit Manipulation",
        "slug": "bit-manipulation"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-longest-increasing-subsequence",
    "slug": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-binary-search",
        "name": "Binary Search",
        "slug": "binary-search"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-longest-common-subsequence",
    "slug": "longest-common-subsequence",
    "title": "Longest Common Subsequence",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-combination-sum",
    "slug": "combination-sum",
    "title": "Combination Sum",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-backtracking",
        "name": "Backtracking",
        "slug": "backtracking"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-house-robber",
    "slug": "house-robber",
    "title": "House Robber",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-house-robber-ii",
    "slug": "house-robber-ii",
    "title": "House Robber II",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-unique-paths",
    "slug": "unique-paths",
    "title": "Unique Paths",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-math",
        "name": "Math",
        "slug": "math"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-combinatorics",
        "name": "Combinatorics",
        "slug": "combinatorics"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-clone-graph",
    "slug": "clone-graph",
    "title": "Clone Graph",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-graph",
        "name": "Graph",
        "slug": "graph"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-pacific-atlantic-water-flow",
    "slug": "pacific-atlantic-water-flow",
    "title": "Pacific Atlantic Water Flow",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-matrix",
        "name": "Matrix",
        "slug": "matrix"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-alien-dictionary",
    "slug": "alien-dictionary",
    "title": "Alien Dictionary",
    "difficulty": "HARD",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-graph",
        "name": "Graph",
        "slug": "graph"
      },
      {
        "id": "tag-topological-sort",
        "name": "Topological Sort",
        "slug": "topological-sort"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "37%"
  },
  {
    "id": "prob-graph-valid-tree",
    "slug": "graph-valid-tree",
    "title": "Graph Valid Tree",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-union-find",
        "name": "Union Find",
        "slug": "union-find"
      },
      {
        "id": "tag-graph",
        "name": "Graph",
        "slug": "graph"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-number-of-connected-components-in-an-undirected-graph",
    "slug": "number-of-connected-components-in-an-undirected-graph",
    "title": "Number of Connected Components in an Undirected Graph",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-union-find",
        "name": "Union Find",
        "slug": "union-find"
      },
      {
        "id": "tag-graph",
        "name": "Graph",
        "slug": "graph"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-insert-interval",
    "slug": "insert-interval",
    "title": "Insert Interval",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-intervals",
        "name": "Intervals",
        "slug": "intervals"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-non-overlapping-intervals",
    "slug": "non-overlapping-intervals",
    "title": "Non-overlapping Intervals",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-greedy",
        "name": "Greedy",
        "slug": "greedy"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-intervals",
        "name": "Intervals",
        "slug": "intervals"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-meeting-rooms",
    "slug": "meeting-rooms",
    "title": "Meeting Rooms",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-intervals",
        "name": "Intervals",
        "slug": "intervals"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-meeting-rooms-ii",
    "slug": "meeting-rooms-ii",
    "title": "Meeting Rooms II",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-greedy",
        "name": "Greedy",
        "slug": "greedy"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-heap",
        "name": "Heap",
        "slug": "heap"
      },
      {
        "id": "tag-intervals",
        "name": "Intervals",
        "slug": "intervals"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-linked-list-cycle",
    "slug": "linked-list-cycle",
    "title": "Linked List Cycle",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-linked-list",
        "name": "Linked List",
        "slug": "linked-list"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-remove-nth-node-from-end-of-list",
    "slug": "remove-nth-node-from-end-of-list",
    "title": "Remove Nth Node From End of List",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-linked-list",
        "name": "Linked List",
        "slug": "linked-list"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-reorder-list",
    "slug": "reorder-list",
    "title": "Reorder List",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-linked-list",
        "name": "Linked List",
        "slug": "linked-list"
      },
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-stack",
        "name": "Stack",
        "slug": "stack"
      },
      {
        "id": "tag-recursion",
        "name": "Recursion",
        "slug": "recursion"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-set-matrix-zeroes",
    "slug": "set-matrix-zeroes",
    "title": "Set Matrix Zeroes",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-matrix",
        "name": "Matrix",
        "slug": "matrix"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-spiral-matrix",
    "slug": "spiral-matrix",
    "title": "Spiral Matrix",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-matrix",
        "name": "Matrix",
        "slug": "matrix"
      },
      {
        "id": "tag-simulation",
        "name": "Simulation",
        "slug": "simulation"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-word-search",
    "slug": "word-search",
    "title": "Word Search",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-backtracking",
        "name": "Backtracking",
        "slug": "backtracking"
      },
      {
        "id": "tag-matrix",
        "name": "Matrix",
        "slug": "matrix"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-longest-repeating-character-replacement",
    "slug": "longest-repeating-character-replacement",
    "title": "Longest Repeating Character Replacement",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-sliding-window",
        "name": "Sliding Window",
        "slug": "sliding-window"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-minimum-window-substring",
    "slug": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "difficulty": "HARD",
    "tags": [
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-sliding-window",
        "name": "Sliding Window",
        "slug": "sliding-window"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "37%"
  },
  {
    "id": "prob-palindromic-substrings",
    "slug": "palindromic-substrings",
    "title": "Palindromic Substrings",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-dynamic-programming",
        "name": "Dynamic Programming",
        "slug": "dynamic-programming"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-encode-and-decode-strings",
    "slug": "encode-and-decode-strings",
    "title": "Encode and Decode Strings",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-design",
        "name": "Design",
        "slug": "design"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-maximum-depth-of-binary-tree",
    "slug": "maximum-depth-of-binary-tree",
    "title": "Maximum Depth of Binary Tree",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-apple",
        "name": "Apple",
        "slug": "apple"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-same-tree",
    "slug": "same-tree",
    "title": "Same Tree",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-breadth-first-search",
        "name": "Breadth-First Search",
        "slug": "breadth-first-search"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-subtree-of-another-tree",
    "slug": "subtree-of-another-tree",
    "title": "Subtree of Another Tree",
    "difficulty": "EASY",
    "tags": [
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-string-matching",
        "name": "String Matching",
        "slug": "string-matching"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-hash-function",
        "name": "Hash Function",
        "slug": "hash-function"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "68%"
  },
  {
    "id": "prob-validate-binary-search-tree",
    "slug": "validate-binary-search-tree",
    "title": "Validate Binary Search Tree",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-binary-search-tree",
        "name": "Binary Search Tree",
        "slug": "binary-search-tree"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-construct-binary-tree-from-preorder-and-inorder-traversal",
    "slug": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-divide-and-conquer",
        "name": "Divide and Conquer",
        "slug": "divide-and-conquer"
      },
      {
        "id": "tag-tree",
        "name": "Tree",
        "slug": "tree"
      },
      {
        "id": "tag-binary-tree",
        "name": "Binary Tree",
        "slug": "binary-tree"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-implement-trie-prefix-tree",
    "slug": "implement-trie-prefix-tree",
    "title": "Implement Trie (Prefix Tree)",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-hash-table",
        "name": "Hash Table",
        "slug": "hash-table"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-design",
        "name": "Design",
        "slug": "design"
      },
      {
        "id": "tag-trie",
        "name": "Trie",
        "slug": "trie"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-design-add-and-search-words-data-structure",
    "slug": "design-add-and-search-words-data-structure",
    "title": "Design Add and Search Words Data Structure",
    "difficulty": "MEDIUM",
    "tags": [
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-depth-first-search",
        "name": "Depth-First Search",
        "slug": "depth-first-search"
      },
      {
        "id": "tag-design",
        "name": "Design",
        "slug": "design"
      },
      {
        "id": "tag-trie",
        "name": "Trie",
        "slug": "trie"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-meta",
        "name": "Meta",
        "slug": "meta"
      }
    ],
    "acceptanceRate": "51%"
  },
  {
    "id": "prob-word-search-ii",
    "slug": "word-search-ii",
    "title": "Word Search II",
    "difficulty": "HARD",
    "tags": [
      {
        "id": "tag-array",
        "name": "Array",
        "slug": "array"
      },
      {
        "id": "tag-string",
        "name": "String",
        "slug": "string"
      },
      {
        "id": "tag-backtracking",
        "name": "Backtracking",
        "slug": "backtracking"
      },
      {
        "id": "tag-trie",
        "name": "Trie",
        "slug": "trie"
      },
      {
        "id": "tag-matrix",
        "name": "Matrix",
        "slug": "matrix"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      },
      {
        "id": "tag-microsoft",
        "name": "Microsoft",
        "slug": "microsoft"
      },
      {
        "id": "tag-uber",
        "name": "Uber",
        "slug": "uber"
      }
    ],
    "acceptanceRate": "37%"
  },
  {
    "id": "prob-find-median-from-data-stream",
    "slug": "find-median-from-data-stream",
    "title": "Find Median from Data Stream",
    "difficulty": "HARD",
    "tags": [
      {
        "id": "tag-two-pointers",
        "name": "Two Pointers",
        "slug": "two-pointers"
      },
      {
        "id": "tag-design",
        "name": "Design",
        "slug": "design"
      },
      {
        "id": "tag-sorting",
        "name": "Sorting",
        "slug": "sorting"
      },
      {
        "id": "tag-heap",
        "name": "Heap",
        "slug": "heap"
      },
      {
        "id": "tag-data-stream",
        "name": "Data Stream",
        "slug": "data-stream"
      },
      {
        "id": "tag-blind-75",
        "name": "Blind 75",
        "slug": "blind-75"
      },
      {
        "id": "tag-leetcode",
        "name": "LeetCode",
        "slug": "leetcode"
      },
      {
        "id": "tag-geeksforgeeks",
        "name": "GeeksforGeeks",
        "slug": "geeksforgeeks"
      },
      {
        "id": "tag-sde-1",
        "name": "SDE 1",
        "slug": "sde-1"
      },
      {
        "id": "tag-google",
        "name": "Google",
        "slug": "google"
      },
      {
        "id": "tag-amazon",
        "name": "Amazon",
        "slug": "amazon"
      }
    ],
    "acceptanceRate": "37%"
  }
];
