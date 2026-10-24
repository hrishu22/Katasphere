export interface ApiErrorResponse {
  type: string;
  message: string;
  fieldErrors?: Record<string, string>;
  requestId?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly details?: ApiErrorResponse;

  constructor(status: number, message: string, details?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

const DEFAULT_LOCAL_API_URL = "http://localhost:8080";
const DEFAULT_PROD_API_URL = "https://katasphere.onrender.com";

const isDev = process.env.NODE_ENV === "development";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (isDev ? DEFAULT_LOCAL_API_URL : DEFAULT_PROD_API_URL);

export function getApiBaseUrl(): string {
  return API_BASE_URL.replace(/\/$/, "");
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const timeoutMs = options.timeoutMs ?? 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const signal = options.signal || controller.signal;

  try {
    const response = await fetch(url, {
      ...options,
      signal,
      headers,
      credentials: "include", // Required for HttpOnly session cookie transmission
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetails: ApiErrorResponse | undefined;
      try {
        errorDetails = await response.json();
      } catch {
        // Fallback if response is not JSON
      }

      const errorMessage =
        errorDetails?.message || `API request failed with status ${response.status}`;
      throw new ApiError(response.status, errorMessage, errorDetails);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new ApiError(504, `Request timed out after ${timeoutMs / 1000}s`);
    }
    throw err;
  }
}

// Health check convenience function
export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
}

export async function checkBackendHealth(): Promise<ApiResponse<HealthStatus>> {
  return apiClient<ApiResponse<HealthStatus>>("/api/v1/health");
}
