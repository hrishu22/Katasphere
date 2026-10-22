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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Required for HttpOnly session cookie transmission
  });

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
