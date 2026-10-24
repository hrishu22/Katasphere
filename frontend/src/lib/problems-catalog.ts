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

export const INITIAL_TAGS: TagDto[] = [
  // Company Tags
  { id: "tag-google", name: "Google", slug: "google" },
  { id: "tag-amazon", name: "Amazon", slug: "amazon" },
  { id: "tag-meta", name: "Meta", slug: "meta" },
  { id: "tag-microsoft", name: "Microsoft", slug: "microsoft" },
  { id: "tag-apple", name: "Apple", slug: "apple" },
  { id: "tag-uber", name: "Uber", slug: "uber" },
  { id: "tag-bloomberg", name: "Bloomberg", slug: "bloomberg" },
  { id: "tag-sde-1", name: "SDE 1", slug: "sde-1" },

  // Topic Tags
  { id: "tag-array", name: "Array", slug: "array" },
  { id: "tag-hash-table", name: "Hash Table", slug: "hash-table" },
  { id: "tag-two-pointers", name: "Two Pointers", slug: "two-pointers" },
  { id: "tag-sliding-window", name: "Sliding Window", slug: "sliding-window" },
  { id: "tag-stack", name: "Stack", slug: "stack" },
  { id: "tag-linked-list", name: "Linked List", slug: "linked-list" },
  { id: "tag-tree", name: "Tree", slug: "tree" },
  { id: "tag-binary-tree", name: "Binary Tree", slug: "binary-tree" },
  { id: "tag-binary-search", name: "Binary Search", slug: "binary-search" },
  { id: "tag-dynamic-programming", name: "Dynamic Programming", slug: "dynamic-programming" },
  { id: "tag-sorting", name: "Sorting", slug: "sorting" },
  { id: "tag-heap", name: "Heap", slug: "heap" },
  { id: "tag-greedy", name: "Greedy", slug: "greedy" },
  { id: "tag-string", name: "String", slug: "string" },
  { id: "tag-math", name: "Math", slug: "math" },
  { id: "tag-bfs", name: "Breadth-First Search", slug: "breadth-first-search" },
  { id: "tag-recursion", name: "Recursion", slug: "recursion" },
];

function makeTags(tagNames: string[]): TagDto[] {
  return tagNames.map((name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { id: `tag-${slug}`, name, slug };
  });
}

export const INITIAL_PROBLEMS: ProblemSummary[] = [
  {
    id: "p-two-sum",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "EASY",
    acceptanceRate: "49.8%",
    tags: makeTags(["Array", "Hash Table", "SDE 1", "Amazon", "Google", "Meta", "Apple"]),
  },
  {
    id: "p-best-time-stock",
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "EASY",
    acceptanceRate: "49.8%",
    tags: makeTags(["Array", "Dynamic Programming", "SDE 1", "Amazon", "Google", "Meta", "Microsoft"]),
  },
  {
    id: "p-valid-parentheses",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "EASY",
    acceptanceRate: "49.8%",
    tags: makeTags(["Stack", "String", "SDE 1", "Meta", "Amazon", "Bloomberg", "Microsoft"]),
  },
  {
    id: "p-valid-palindrome",
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "EASY",
    acceptanceRate: "49.8%",
    tags: makeTags(["Two Pointers", "String", "SDE 1", "Meta", "Microsoft", "Apple"]),
  },
  {
    id: "p-longest-substring",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Hash Table", "String", "Sliding Window", "SDE 1", "Google", "Amazon", "Bloomberg"]),
  },
  {
    id: "p-container-most-water",
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Array", "Two Pointers", "Greedy", "SDE 1", "Google", "Amazon", "Meta"]),
  },
  {
    id: "p-maximum-subarray",
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Array", "Divide and Conquer", "Dynamic Programming", "SDE 1", "Amazon", "Microsoft", "Apple", "Google"]),
  },
  {
    id: "p-climbing-stairs",
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "EASY",
    acceptanceRate: "49.8%",
    tags: makeTags(["Math", "Dynamic Programming", "Memoization", "SDE 1", "Google", "Amazon", "Apple"]),
  },
  {
    id: "p-3sum",
    slug: "3sum",
    title: "3Sum",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Array", "Two Pointers", "Sorting", "SDE 1", "Google", "Meta", "Amazon", "Microsoft"]),
  },
  {
    id: "p-reverse-linked-list",
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "EASY",
    acceptanceRate: "49.8%",
    tags: makeTags(["Linked List", "Recursion", "SDE 1", "Google", "Amazon", "Microsoft", "Apple", "Uber"]),
  },
  {
    id: "p-merge-two-sorted-lists",
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "EASY",
    acceptanceRate: "49.8%",
    tags: makeTags(["Linked List", "Recursion", "SDE 1", "Amazon", "Microsoft", "Meta", "Apple"]),
  },
  {
    id: "p-invert-binary-tree",
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "EASY",
    acceptanceRate: "49.8%",
    tags: makeTags(["Tree", "Binary Tree", "Breadth-First Search", "SDE 1", "Google", "Amazon", "Microsoft", "Uber"]),
  },
  {
    id: "p-level-order-traversal",
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Tree", "Binary Tree", "Breadth-First Search", "SDE 1", "Amazon", "Meta", "Microsoft", "Bloomberg"]),
  },
  {
    id: "p-kth-largest",
    slug: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Array", "Divide and Conquer", "Sorting", "Heap", "Quickselect", "SDE 1", "Meta", "Amazon", "Google", "Uber"]),
  },
  {
    id: "p-product-except-self",
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Array", "Prefix Sum", "SDE 1", "Amazon", "Meta", "Microsoft", "Apple"]),
  },
  {
    id: "p-group-anagrams",
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Array", "Hash Table", "String", "Sorting", "SDE 1", "Google", "Amazon", "Meta", "Apple"]),
  },
  {
    id: "p-search-rotated",
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "MEDIUM",
    acceptanceRate: "36.4%",
    tags: makeTags(["Array", "Binary Search", "SDE 1", "Google", "Meta", "Amazon", "Microsoft"]),
  },
];

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

export const INITIAL_COMPANIES: CompanySummary[] = [
  {
    name: "Google",
    slug: "google",
    accentColor: "#4285F4",
    description: "Google SDE-1 interviews emphasize data structures, edge cases, clean code, and time/space complexity.",
    interviewRounds: "1 Technical Screen + 3 Onsite DSA Rounds",
    totalProblems: 12,
    easyCount: 5,
    mediumCount: 7,
    hardCount: 0,
    isPremium: true,
  },
  {
    name: "Amazon",
    slug: "amazon",
    accentColor: "#FF9900",
    description: "Amazon technical rounds test arrays, trees, heaps, and Leadership Principles applied to engineering trade-offs.",
    interviewRounds: "Online Assessment (OA) + 3 Onsite Rounds",
    totalProblems: 16,
    easyCount: 7,
    mediumCount: 9,
    hardCount: 0,
    isPremium: true,
  },
  {
    name: "Meta",
    slug: "meta",
    accentColor: "#0668E1",
    description: "Meta focuses on rapid problem-solving, binary search, sliding windows, and writing clean, optimal code under time pressure.",
    interviewRounds: "1 Technical Screen + 2 Onsite Coding Rounds",
    totalProblems: 12,
    easyCount: 5,
    mediumCount: 7,
    hardCount: 0,
    isPremium: true,
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    accentColor: "#00A4EF",
    description: "Microsoft interviews emphasize arrays, strings, tree traversals, and dynamic programming fundamentals.",
    interviewRounds: "Codility OA + 4 Technical Rounds",
    totalProblems: 11,
    easyCount: 6,
    mediumCount: 5,
    hardCount: 0,
    isPremium: true,
  },
  {
    name: "Apple",
    slug: "apple",
    accentColor: "#A2AAAD",
    description: "Apple software engineering evaluations stress linked lists, binary trees, algorithms, and modular design.",
    interviewRounds: "Recruiter Screen + 2 Technical Interviews",
    totalProblems: 8,
    easyCount: 5,
    mediumCount: 3,
    hardCount: 0,
    isPremium: true,
  },
  {
    name: "Uber",
    slug: "uber",
    accentColor: "#000000",
    description: "Uber SDE-1 rounds evaluate algorithmic efficiency, heaps, graphs, and two-pointer solutions.",
    interviewRounds: "CodeSignal OA + 3 Algorithm Rounds",
    totalProblems: 3,
    easyCount: 2,
    mediumCount: 1,
    hardCount: 0,
    isPremium: true,
  },
  {
    name: "Bloomberg",
    slug: "bloomberg",
    accentColor: "#9333EA",
    description: "Bloomberg interviews focus heavily on hash tables, stacks, queues, and tree traversals.",
    interviewRounds: "Phone Screen + 2 Onsite Rounds",
    totalProblems: 3,
    easyCount: 1,
    mediumCount: 2,
    hardCount: 0,
    isPremium: true,
  },
  {
    name: "Netflix",
    slug: "netflix",
    accentColor: "#E50914",
    description: "Netflix prioritizes high-performance algorithms, system thinking, and deep computer science fundamentals.",
    interviewRounds: "Technical Screen + 2 High-Bar Rounds",
    totalProblems: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    isPremium: true,
  },
];
