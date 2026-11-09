export interface ContestDto {
  id: string;
  collegeName: string;
  title: string;
  slug: string;
  description: string;
  accessCode: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  scoringSystem: string;
  allowTabSwitch: boolean;
  maxTabSwitches: number;
  isPublished: boolean;
  totalProblems: number;
  totalParticipants: number;
  status: "UPCOMING" | "ACTIVE" | "CONCLUDED";
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
  contestId: string;
  problemId: string;
  problemTitle: string;
  studentId: string;
  studentName: string;
  language: string;
  verdict: string;
  passedTestCases: number;
  totalTestCases: number;
  scoreAwarded: number;
  runtimeMs: number;
  memoryKb: number;
  createdAt: string;
  compileOutput?: string | null;
  errorMessage?: string | null;
}

export interface ContestLeaderboardEntryDto {
  rank: number;
  participantId: string;
  studentName: string;
  studentEmail: string;
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
  collegeName: string;
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
