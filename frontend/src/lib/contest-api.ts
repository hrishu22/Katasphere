import { apiClient, ApiResponse, getApiBaseUrl, invalidateApiCache } from "./api-client";
import {
  ContestDto,
  ContestDetailDto,
  ContestProblemDto,
  ContestParticipantDto,
  ContestSubmissionDto,
  ContestLeaderboardEntryDto,
  CreateContestPayload,
  RegisterCollegePayload,
  CollegePlanOptionDto,
  LinkCollegePayload,
  CollegeSuggestionDto,
  CollegeAdminDto,
  StudentCollegeDto,
  CollegeContextDto,
  StudentExamDashboardDto,
} from "@/types/contest";

function normalizeStatus(status: string): "UPCOMING" | "ACTIVE" | "CONCLUDED" {
  if (status === "PAST" || status === "CONCLUDED") return "CONCLUDED";
  if (status === "UPCOMING") return "UPCOMING";
  return "ACTIVE";
}

function normalizeContestDto(raw: any): ContestDto {
  return {
    ...raw,
    status: normalizeStatus(raw?.status || "ACTIVE"),
  };
}

function parseStarterCode(rawStarter: any): Record<string, string> {
  if (!rawStarter) return {};
  if (typeof rawStarter === "object") return rawStarter as Record<string, string>;
  if (typeof rawStarter === "string") {
    try {
      const parsed = JSON.parse(rawStarter);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      return { JAVA: rawStarter };
    }
  }
  return {};
}

function normalizeProblemDto(raw: any, index: number): ContestProblemDto {
  const sampleCases = raw?.sampleTestCases || raw?.publicTestCases || [];
  return {
    id: raw?.id || raw?.problemId || `prob-${index}`,
    problemId: raw?.problemId || raw?.id || "",
    title: raw?.title || `Problem ${String.fromCharCode(65 + index)}`,
    slug: raw?.slug || "",
    difficulty: (raw?.difficulty || "EASY") as "EASY" | "MEDIUM" | "HARD",
    orderIndex: raw?.orderIndex ?? raw?.problemOrder ?? index,
    points: raw?.points ?? 100,
    description: raw?.description || "",
    starterCode: parseStarterCode(raw?.starterCode),
    sampleTestCases: sampleCases.map((tc: any, i: number) => ({
      caseNumber: tc?.caseNumber ?? i + 1,
      input: tc?.input ?? "",
      expectedOutput: tc?.expectedOutput ?? "",
    })),
  };
}

function normalizeSubmissionDto(raw: any): ContestSubmissionDto {
  return {
    ...raw,
    scoreAwarded: raw?.scoreAwarded ?? raw?.pointsAwarded ?? 0,
    runtimeMs: raw?.runtimeMs ?? raw?.executionTimeMs ?? 0,
    compileOutput: raw?.compileOutput ?? raw?.errorMessage ?? null,
  };
}

export async function getContests(): Promise<ContestDto[]> {
  const res = await apiClient<ApiResponse<any[]>>("/api/v1/contests", { cacheTtlMs: 10000 });
  return (res.data || []).map(normalizeContestDto);
}

export async function getContestDetail(slug: string): Promise<ContestDetailDto> {
  const res = await apiClient<ApiResponse<any>>(`/api/v1/contests/${slug}`, { cacheTtlMs: 5000 });
  const raw = res.data;
  const rawContest = raw?.contest || raw;
  const rawProblems: any[] = raw?.problems || [];
  return {
    contest: normalizeContestDto({
      ...rawContest,
      totalProblems: rawContest?.totalProblems ?? rawProblems.length,
      totalParticipants: rawContest?.totalParticipants ?? 0,
    }),
    problems: rawProblems.map(normalizeProblemDto),
  };
}

export async function getParticipantState(slug: string): Promise<ContestParticipantDto | null> {
  try {
    const res = await apiClient<ApiResponse<ContestParticipantDto>>(`/api/v1/contests/${slug}/status`, {
      cacheTtlMs: 0,
    });
    return res.data;
  } catch (err: any) {
    if (err?.status === 404 || err?.status === 401) {
      return null;
    }
    throw err;
  }
}

export async function joinContest(slug: string, accessCode: string): Promise<ContestParticipantDto> {
  const res = await apiClient<ApiResponse<ContestParticipantDto>>(`/api/v1/contests/${slug}/join`, {
    method: "POST",
    body: JSON.stringify({ accessCode }),
  });
  invalidateApiCache();
  return res.data;
}

export interface RunSampleResponse {
  verdict: string;
  totalTestCases: number;
  passedTestCases: number;
  runtimeMs: number;
  memoryKb: number;
  compileOutput?: string;
  errorMessage?: string;
  testCases: Array<{
    caseNumber: number;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    error?: string;
    executionTimeMs?: number;
    status: string;
    stdout?: string | null;
  }>;
}

export async function runSampleCode(
  slug: string,
  problemId: string,
  payload: { problemSlug: string; language: string; sourceCode: string }
): Promise<RunSampleResponse> {
  const res = await apiClient<ApiResponse<RunSampleResponse>>(`/api/v1/contests/${slug}/run/${problemId}`, {
    method: "POST",
    body: JSON.stringify(payload),
    timeoutMs: 25000,
  });
  return res.data;
}

export async function submitContestCode(
  slug: string,
  payload: { problemId: string; language: string; sourceCode: string }
): Promise<ContestSubmissionDto> {
  const res = await apiClient<ApiResponse<any>>(`/api/v1/contests/${slug}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
    timeoutMs: 35000,
  });
  invalidateApiCache();
  return normalizeSubmissionDto(res.data);
}

export async function recordTabSwitch(slug: string): Promise<ContestParticipantDto> {
  const res = await apiClient<ApiResponse<ContestParticipantDto>>(`/api/v1/contests/${slug}/tab-switch`, {
    method: "POST",
  });
  return res.data;
}

export async function finishExam(slug: string): Promise<ContestParticipantDto> {
  const res = await apiClient<ApiResponse<ContestParticipantDto>>(`/api/v1/contests/${slug}/finish`, {
    method: "POST",
  });
  invalidateApiCache();
  return res.data;
}

export async function getContestLeaderboard(slug: string): Promise<ContestLeaderboardEntryDto[]> {
  const res = await apiClient<ApiResponse<ContestLeaderboardEntryDto[]>>(`/api/v1/contests/${slug}/leaderboard`, {
    cacheTtlMs: 8000,
  });
  return res.data || [];
}

export async function getMyContestSubmissions(slug: string): Promise<ContestSubmissionDto[]> {
  const res = await apiClient<ApiResponse<any[]>>(`/api/v1/contests/${slug}/submissions/me`, {
    cacheTtlMs: 0,
  });
  return (res.data || []).map(normalizeSubmissionDto);
}

// ======================== FACULTY / ADMIN APIS ========================

export async function getFacultyContests(): Promise<ContestDto[]> {
  const res = await apiClient<ApiResponse<any[]>>("/api/v1/admin/contests", { cacheTtlMs: 5000 });
  return (res.data || []).map(normalizeContestDto);
}

export async function createFacultyContest(payload: CreateContestPayload): Promise<ContestDto> {
  const res = await apiClient<ApiResponse<any>>("/api/v1/admin/contests", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      problems: payload.problems.map((p, idx) => ({
        problemId: p.problemId,
        points: p.points,
        order: p.orderIndex + 1,
        orderIndex: p.orderIndex,
      })),
    }),
  });
  invalidateApiCache();
  return normalizeContestDto(res.data);
}

export async function getAdminParticipants(slug: string): Promise<ContestParticipantDto[]> {
  const res = await apiClient<ApiResponse<ContestParticipantDto[]>>(`/api/v1/admin/contests/${slug}/participants`, {
    cacheTtlMs: 0,
  });
  return res.data || [];
}

export async function getAdminSubmissions(slug: string): Promise<ContestSubmissionDto[]> {
  const res = await apiClient<ApiResponse<any[]>>(`/api/v1/admin/contests/${slug}/submissions`, {
    cacheTtlMs: 0,
  });
  return (res.data || []).map(normalizeSubmissionDto);
}

export function getExportGradebookUrl(slug: string): string {
  return `${getApiBaseUrl()}/api/v1/admin/contests/${slug}/export-csv`;
}

// ======================== COLLEGE & STUDENT AFFILIATION APIS ========================

export async function getCollegeSuggestions(query?: string): Promise<CollegeSuggestionDto[]> {
  const qs = query && query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
  const res = await apiClient<ApiResponse<CollegeSuggestionDto[]>>(`/api/v1/colleges/suggestions${qs}`, {
    cacheTtlMs: 10000,
  });
  return res.data || [];
}

export async function getMyCollegeContext(): Promise<CollegeContextDto> {
  const res = await apiClient<ApiResponse<CollegeContextDto>>("/api/v1/colleges/me/context", {
    cacheTtlMs: 10000,
  });
  return res.data;
}

export async function registerCollege(payload: RegisterCollegePayload): Promise<CollegeAdminDto> {
  const res = await apiClient<ApiResponse<CollegeAdminDto>>("/api/v1/colleges", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  invalidateApiCache();
  return res.data;
}

export async function updateMyCollege(payload: RegisterCollegePayload): Promise<CollegeAdminDto> {
  const res = await apiClient<ApiResponse<CollegeAdminDto>>("/api/v1/colleges/mine", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  invalidateApiCache();
  return res.data;
}

export async function getCollegePlans(): Promise<CollegePlanOptionDto[]> {
  const res = await apiClient<ApiResponse<CollegePlanOptionDto[]>>("/api/v1/colleges/plans", {
    cacheTtlMs: 30000,
  });
  return res.data || [];
}

export async function selectOrExtendCollegePlan(planCode: string): Promise<CollegeAdminDto> {
  const res = await apiClient<ApiResponse<CollegeAdminDto>>("/api/v1/colleges/mine/plan", {
    method: "POST",
    body: JSON.stringify({ planCode }),
  });
  invalidateApiCache();
  return res.data;
}

export async function purchaseAdditionalContests(additionalContests: number): Promise<CollegeAdminDto> {
  const res = await apiClient<ApiResponse<CollegeAdminDto>>("/api/v1/colleges/mine/topup-contests", {
    method: "POST",
    body: JSON.stringify({ additionalContests }),
  });
  invalidateApiCache();
  return res.data;
}

export async function linkStudentCollege(payload: LinkCollegePayload): Promise<StudentCollegeDto> {
  const res = await apiClient<ApiResponse<StudentCollegeDto>>("/api/v1/colleges/me/link", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  invalidateApiCache();
  return res.data;
}

export async function getStudentExamDashboard(): Promise<StudentExamDashboardDto> {
  const res = await apiClient<ApiResponse<StudentExamDashboardDto>>("/api/v1/colleges/me/exams", {
    cacheTtlMs: 8000,
  });
  return res.data;
}
