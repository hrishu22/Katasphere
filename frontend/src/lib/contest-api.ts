import { apiClient, ApiResponse, getApiBaseUrl } from "./api-client";
import {
  ContestDto,
  ContestDetailDto,
  ContestParticipantDto,
  ContestSubmissionDto,
  ContestLeaderboardEntryDto,
  CreateContestPayload,
} from "@/types/contest";

export async function getContests(): Promise<ContestDto[]> {
  const res = await apiClient<ApiResponse<ContestDto[]>>("/api/v1/contests");
  return res.data || [];
}

export async function getContestDetail(slug: string): Promise<ContestDetailDto> {
  const res = await apiClient<ApiResponse<ContestDetailDto>>(`/api/v1/contests/${slug}`);
  return res.data;
}

export async function getParticipantState(slug: string): Promise<ContestParticipantDto | null> {
  try {
    const res = await apiClient<ApiResponse<ContestParticipantDto>>(`/api/v1/contests/${slug}/status`);
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
  const res = await apiClient<ApiResponse<ContestSubmissionDto>>(`/api/v1/contests/${slug}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
    timeoutMs: 35000,
  });
  return res.data;
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
  return res.data;
}

export async function getContestLeaderboard(slug: string): Promise<ContestLeaderboardEntryDto[]> {
  const res = await apiClient<ApiResponse<ContestLeaderboardEntryDto[]>>(`/api/v1/contests/${slug}/leaderboard`);
  return res.data || [];
}

export async function getMyContestSubmissions(slug: string): Promise<ContestSubmissionDto[]> {
  const res = await apiClient<ApiResponse<ContestSubmissionDto[]>>(`/api/v1/contests/${slug}/submissions/me`);
  return res.data || [];
}

// ======================== FACULTY / ADMIN APIS ========================

export async function getFacultyContests(): Promise<ContestDto[]> {
  const res = await apiClient<ApiResponse<ContestDto[]>>("/api/v1/admin/contests");
  return res.data || [];
}

export async function createFacultyContest(payload: CreateContestPayload): Promise<ContestDto> {
  const res = await apiClient<ApiResponse<ContestDto>>("/api/v1/admin/contests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function getAdminParticipants(slug: string): Promise<ContestParticipantDto[]> {
  const res = await apiClient<ApiResponse<ContestParticipantDto[]>>(`/api/v1/admin/contests/${slug}/participants`);
  return res.data || [];
}

export async function getAdminSubmissions(slug: string): Promise<ContestSubmissionDto[]> {
  const res = await apiClient<ApiResponse<ContestSubmissionDto[]>>(`/api/v1/admin/contests/${slug}/submissions`);
  return res.data || [];
}

export function getExportGradebookUrl(slug: string): string {
  return `${getApiBaseUrl()}/api/v1/admin/contests/${slug}/export-csv`;
}
