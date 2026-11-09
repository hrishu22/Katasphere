export interface ContestDto {
  id: string;
  collegeName: string;
  title: string;
  slug: string;
  description: string;
  accessCode: string | null;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  scoringSystem: string;
  allowTabSwitch: boolean;
  maxTabSwitches: number;
  isPublished: boolean;
  totalProblems: number;
  totalParticipants: number;
  status: "UPCOMING" | "ACTIVE" | "CONCLUDED" | "PAST";
}

export interface ContestSampleTestCaseDto {
  caseNumber: number;
  input: string;
  expectedOutput: string;
}

export interface ContestProblemDto {
  id: string;
  problemId: string;
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  orderIndex: number;
  points: number;
  description: string;
  starterCode: Record<string, string>;
  sampleTestCases: ContestSampleTestCaseDto[];
}

export interface ContestDetailDto {
  contest: ContestDto;
  problems: ContestProblemDto[];
}

export interface ContestParticipantDto {
  id: string;
  contestId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  startedAt: string;
  submittedAt: string | null;
  totalScore: number;
  penaltySeconds: number;
  tabSwitchCount: number;
  status: "REGISTERED" | "IN_PROGRESS" | "SUBMITTED" | "FLAGGED_VIOLATION";
  timeRemainingSeconds: number;
}

export interface ContestSubmissionDto {
  id: string;
  contestId?: string;
  problemId: string;
  problemSlug?: string;
  problemTitle: string;
  studentId?: string;
  studentName: string;
  language: string;
  verdict: string;
  passedTestCases: number;
  totalTestCases: number;
  scoreAwarded: number;
  pointsAwarded?: number;
  runtimeMs: number;
  executionTimeMs?: number;
  memoryKb: number;
  createdAt: string;
  compileOutput?: string | null;
  errorMessage?: string | null;
}

export interface ContestLeaderboardEntryDto {
  rank: number;
  participantId: string;
  studentName: string;
  studentEmail: string | null;
  totalScore: number;
  penaltySeconds: number;
  status: string;
  tabSwitchCount: number;
}

export interface CreateContestProblemItem {
  problemId: string;
  points: number;
  orderIndex: number;
}

export interface CreateContestPayload {
  collegeName?: string;
  title: string;
  slug: string;
  description?: string;
  accessCode: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  scoringSystem: "POINTS" | "ICPC_PENALTY";
  allowTabSwitch: boolean;
  maxTabSwitches: number;
  isPublished?: boolean;
  problems: CreateContestProblemItem[];
}

// ======================== COLLEGE & STUDENT AFFILIATION ========================

export interface RegisterCollegePayload {
  name: string;
  officialEmail: string;
  expectedStudents?: number;
  department?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  planCode?: string;
}

export interface CollegePlanOptionDto {
  planCode: "STARTER_MONTHLY" | "GROWTH_MONTHLY" | "CAMPUS_YEARLY" | string;
  name: string;
  contestsIncluded: number;
  periodLabel: string;
  priceInr: number;
  topUpPricePerContestInr: number;
  description: string;
}

export interface LinkCollegePayload {
  collegeName: string;
  collegeCode: string;
  rollNumber?: string;
  tenureStartYear?: number;
  tenureEndYear: number;
}

export interface CollegeSuggestionDto {
  id: string;
  collegeCode: string;
  name: string;
  department?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  linkedStudents: number;
  totalContests: number;
}

export interface CollegeAdminDto {
  id: string;
  collegeCode: string;
  name: string;
  officialEmail: string;
  expectedStudents?: number | null;
  department?: string | null;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country: string;
  linkedStudents: number;
  totalContests: number;
  planCode: string;
  planName: string;
  contestQuotaTotal: number;
  contestsUsed: number;
  contestsLeft: number;
  topUpPricePerContestInr: number;
  planExpiresAt?: string | null;
  createdAt: string;
}

export interface StudentCollegeDto {
  id: string;
  collegeCode: string;
  name: string;
  officialEmail?: string | null;
  department?: string | null;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  expectedStudents?: number;
  linkedStudents?: number;
  totalContests?: number;
  rollNumber?: string | null;
  tenureStartYear?: number | null;
  tenureEndYear?: number | null;
  isTenureExpired?: boolean;
  createdAt?: string;
}

export interface CollegeContextDto {
  adminCollege: CollegeAdminDto | null;
  studentCollege: StudentCollegeDto | null;
}

export interface ExamSummaryDto {
  contestId: string;
  slug: string;
  title: string;
  collegeName: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: "UPCOMING" | "ACTIVE" | "PAST";
  totalProblems: number;
  maxScore: number;
  participationStatus?: string | null;
  score?: number | null;
  rank?: number | null;
  totalParticipants?: number | null;
  tabSwitchCount?: number | null;
  solvedProblems?: number | null;
}

export interface StudentExamDashboardDto {
  college: StudentCollegeDto | null;
  isTenureExpired?: boolean;
  upcoming: ExamSummaryDto[];
  active: ExamSummaryDto[];
  past: ExamSummaryDto[];
  collegeHistory: ExamSummaryDto[];
  examsAttempted: number;
  bestRank: number | null;
  averageScorePercent: number;
}
