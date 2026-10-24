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
    "id": "tag-binary-search",
    "name": "Binary Search",
    "slug": "binary-search"
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
    "id": "tag-breadth-first-search",
    "name": "Breadth-First Search",
    "slug": "breadth-first-search"
  },
  {
    "id": "tag-bucket-sort",
    "name": "Bucket Sort",
    "slug": "bucket-sort"
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
    "id": "tag-divide-and-conquer",
    "name": "Divide and Conquer",
    "slug": "divide-and-conquer"
  },
  {
    "id": "tag-doubly-linked-list",
    "name": "Doubly-Linked List",
    "slug": "doubly-linked-list"
  },
  {
    "id": "tag-dynamic-programming",
    "name": "Dynamic Programming",
    "slug": "dynamic-programming"
  },
  {
    "id": "tag-graph",
    "name": "Graph",
    "slug": "graph"
  },
  {
    "id": "tag-greedy",
    "name": "Greedy",
    "slug": "greedy"
  },
  {
    "id": "tag-hash-table",
    "name": "Hash Table",
    "slug": "hash-table"
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
    "id": "tag-linked-list",
    "name": "Linked List",
    "slug": "linked-list"
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
    "id": "tag-memoization",
    "name": "Memoization",
    "slug": "memoization"
  },
  {
    "id": "tag-merge-sort",
    "name": "Merge Sort",
    "slug": "merge-sort"
  },
  {
    "id": "tag-prefix-sum",
    "name": "Prefix Sum",
    "slug": "prefix-sum"
  },
  {
    "id": "tag-quickselect",
    "name": "Quickselect",
    "slug": "quickselect"
  },
  {
    "id": "tag-recursion",
    "name": "Recursion",
    "slug": "recursion"
  },
  {
    "id": "tag-sliding-window",
    "name": "Sliding Window",
    "slug": "sliding-window"
  },
  {
    "id": "tag-sorting",
    "name": "Sorting",
    "slug": "sorting"
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
    "id": "tag-topological-sort",
    "name": "Topological Sort",
    "slug": "topological-sort"
  },
  {
    "id": "tag-tree",
    "name": "Tree",
    "slug": "tree"
  },
  {
    "id": "tag-trie",
    "name": "Trie",
    "slug": "trie"
  },
  {
    "id": "tag-two-pointers",
    "name": "Two Pointers",
    "slug": "two-pointers"
  },
  {
    "id": "tag-union-find",
    "name": "Union Find",
    "slug": "union-find"
  }
];

export const INITIAL_PROBLEMS: ProblemSummary[] = [
  {
    "id": "p-two-sum",
    "slug": "two-sum",
    "title": "Two Sum",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-best-time-to-buy-and-sell-stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-valid-parentheses",
    "slug": "valid-parentheses",
    "title": "Valid Parentheses",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-valid-palindrome",
    "slug": "valid-palindrome",
    "title": "Valid Palindrome",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-longest-substring-without-repeating-characters",
    "slug": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-container-with-most-water",
    "slug": "container-with-most-water",
    "title": "Container With Most Water",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-maximum-subarray",
    "slug": "maximum-subarray",
    "title": "Maximum Subarray",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-climbing-stairs",
    "slug": "climbing-stairs",
    "title": "Climbing Stairs",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-3sum",
    "slug": "3sum",
    "title": "3Sum",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-reverse-linked-list",
    "slug": "reverse-linked-list",
    "title": "Reverse Linked List",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-merge-two-sorted-lists",
    "slug": "merge-two-sorted-lists",
    "title": "Merge Two Sorted Lists",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-invert-binary-tree",
    "slug": "invert-binary-tree",
    "title": "Invert Binary Tree",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-binary-tree-level-order-traversal",
    "slug": "binary-tree-level-order-traversal",
    "title": "Binary Tree Level Order Traversal",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-kth-largest-element-in-an-array",
    "slug": "kth-largest-element-in-an-array",
    "title": "Kth Largest Element in an Array",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-product-of-array-except-self",
    "slug": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-group-anagrams",
    "slug": "group-anagrams",
    "title": "Group Anagrams",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-search-in-rotated-sorted-array",
    "slug": "search-in-rotated-sorted-array",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-trapping-rain-water",
    "slug": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "difficulty": "HARD",
    "acceptanceRate": "24.2%",
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
      }
    ]
  },
  {
    "id": "p-longest-palindromic-substring",
    "slug": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-subarray-sum-equals-k",
    "slug": "subarray-sum-equals-k",
    "title": "Subarray Sum Equals K",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-merge-intervals",
    "slug": "merge-intervals",
    "title": "Merge Intervals",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-coin-change",
    "slug": "coin-change",
    "title": "Coin Change",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-word-break",
    "slug": "word-break",
    "title": "Word Break",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-number-of-islands",
    "slug": "number-of-islands",
    "title": "Number of Islands",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-course-schedule",
    "slug": "course-schedule",
    "title": "Course Schedule",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-lowest-common-ancestor-of-a-binary-tree",
    "slug": "lowest-common-ancestor-of-a-binary-tree",
    "title": "Lowest Common Ancestor of a Binary Tree",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-median-of-two-sorted-arrays",
    "slug": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "difficulty": "HARD",
    "acceptanceRate": "24.2%",
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
      }
    ]
  },
  {
    "id": "p-lru-cache",
    "slug": "lru-cache",
    "title": "LRU Cache",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-find-minimum-in-rotated-sorted-array",
    "slug": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-binary-tree-maximum-path-sum",
    "slug": "binary-tree-maximum-path-sum",
    "title": "Binary Tree Maximum Path Sum",
    "difficulty": "HARD",
    "acceptanceRate": "24.2%",
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
      }
    ]
  },
  {
    "id": "p-rotate-image",
    "slug": "rotate-image",
    "title": "Rotate Image",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-merge-k-sorted-lists",
    "slug": "merge-k-sorted-lists",
    "title": "Merge k Sorted Lists",
    "difficulty": "HARD",
    "acceptanceRate": "24.2%",
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
      }
    ]
  },
  {
    "id": "p-valid-anagram",
    "slug": "valid-anagram",
    "title": "Valid Anagram",
    "difficulty": "EASY",
    "acceptanceRate": "49.8%",
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
      }
    ]
  },
  {
    "id": "p-top-k-frequent-elements",
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-jump-game",
    "slug": "jump-game",
    "title": "Jump Game",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-kth-smallest-element-in-a-bst",
    "slug": "kth-smallest-element-in-a-bst",
    "title": "Kth Smallest Element in a BST",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  },
  {
    "id": "p-decode-ways",
    "slug": "decode-ways",
    "title": "Decode Ways",
    "difficulty": "MEDIUM",
    "acceptanceRate": "36.4%",
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
      }
    ]
  }
];

export const INITIAL_COMPANIES: CompanySummary[] = [
  {
    "name": "Google",
    "slug": "google",
    "accentColor": "#4285F4",
    "description": "Google SDE-1 interviews emphasize data structures, edge cases, clean code, and time/space complexity.",
    "interviewRounds": "1 Technical Screen + 3 Onsite DSA Rounds",
    "totalProblems": 28,
    "easyCount": 6,
    "mediumCount": 18,
    "hardCount": 4,
    "isPremium": true
  },
  {
    "name": "Amazon",
    "slug": "amazon",
    "accentColor": "#FF9900",
    "description": "Amazon technical rounds test arrays, trees, heaps, and Leadership Principles applied to engineering trade-offs.",
    "interviewRounds": "Online Assessment (OA) + 3 Onsite Rounds",
    "totalProblems": 36,
    "easyCount": 8,
    "mediumCount": 24,
    "hardCount": 4,
    "isPremium": true
  },
  {
    "name": "Meta",
    "slug": "meta",
    "accentColor": "#0668E1",
    "description": "Meta focuses on rapid problem-solving, binary search, sliding windows, and writing clean, optimal code under time pressure.",
    "interviewRounds": "1 Technical Screen + 2 Onsite Coding Rounds",
    "totalProblems": 26,
    "easyCount": 6,
    "mediumCount": 17,
    "hardCount": 3,
    "isPremium": true
  },
  {
    "name": "Microsoft",
    "slug": "microsoft",
    "accentColor": "#00A4EF",
    "description": "Microsoft interviews emphasize arrays, strings, tree traversals, and dynamic programming fundamentals.",
    "interviewRounds": "Codility OA + 4 Technical Rounds",
    "totalProblems": 26,
    "easyCount": 6,
    "mediumCount": 17,
    "hardCount": 3,
    "isPremium": true
  },
  {
    "name": "Apple",
    "slug": "apple",
    "accentColor": "#A2AAAD",
    "description": "Apple software engineering evaluations stress linked lists, binary trees, algorithms, and modular design.",
    "interviewRounds": "Recruiter Screen + 2 Technical Interviews",
    "totalProblems": 12,
    "easyCount": 5,
    "mediumCount": 6,
    "hardCount": 1,
    "isPremium": true
  },
  {
    "name": "Uber",
    "slug": "uber",
    "accentColor": "#000000",
    "description": "Uber SDE-1 rounds evaluate algorithmic efficiency, heaps, graphs, and two-pointer solutions.",
    "interviewRounds": "CodeSignal OA + 3 Algorithm Rounds",
    "totalProblems": 7,
    "easyCount": 2,
    "mediumCount": 4,
    "hardCount": 1,
    "isPremium": true
  },
  {
    "name": "Bloomberg",
    "slug": "bloomberg",
    "accentColor": "#9333EA",
    "description": "Bloomberg interviews focus heavily on hash tables, stacks, queues, and tree traversals.",
    "interviewRounds": "Phone Screen + 2 Onsite Rounds",
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
    "description": "Netflix prioritizes high-performance algorithms, system thinking, and deep computer science fundamentals.",
    "interviewRounds": "Technical Screen + 2 High-Bar Rounds",
    "totalProblems": 0,
    "easyCount": 0,
    "mediumCount": 0,
    "hardCount": 0,
    "isPremium": true
  }
];
