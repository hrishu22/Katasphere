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

// Fast in-memory Stale-While-Revalidate (SWR) response cache + in-flight request deduplication
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
}
const responseCache = new Map<string, CacheEntry>();
const inflightRequests = new Map<string, Promise<any>>();

export function invalidateApiCache(prefix?: string) {
  if (!prefix) {
    responseCache.clear();
    return;
  }
  const normalized = prefix.replace(/^\//, "");
  Array.from(responseCache.keys()).forEach((key) => {
    if (key.includes(normalized)) {
      responseCache.delete(key);
    }
  });
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { timeoutMs?: number; cacheTtlMs?: number } = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const method = (options.method || "GET").toUpperCase();
  const cacheTtlMs = options.cacheTtlMs ?? (method === "GET" ? 15000 : 0);

  // Any mutation automatically invalidates cached GET entries so UI stays fresh
  if (method !== "GET") {
    responseCache.clear();
  }

  let token: string | null = null;
  let authHeader: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      token = localStorage.getItem("katasphere_token");
      if (token) {
        authHeader["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access restrictions
    }
  }

  const cacheKey = `${method}:${url}:${token ? token.slice(-12) : "anon"}`;

  if (method === "GET" && cacheTtlMs > 0) {
    const cached = responseCache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.timestamp < cacheTtlMs) {
      return cached.data as T;
    }
    const existingInflight = inflightRequests.get(cacheKey);
    if (existingInflight) {
      return existingInflight as Promise<T>;
    }
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...authHeader,
    ...options.headers,
  };

  const timeoutMs = options.timeoutMs ?? 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const signal = options.signal || controller.signal;

  const requestPromise = (async (): Promise<T> => {
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

      const json = (await response.json()) as T;
      if (method === "GET" && cacheTtlMs > 0) {
        responseCache.set(cacheKey, { data: json, timestamp: Date.now() });
      }
      return json;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new ApiError(504, `Request timed out after ${timeoutMs / 1000}s`);
      }
      throw err;
    } finally {
      inflightRequests.delete(cacheKey);
    }
  })();

  if (method === "GET" && cacheTtlMs > 0) {
    inflightRequests.set(cacheKey, requestPromise);
  }

  return requestPromise;
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
