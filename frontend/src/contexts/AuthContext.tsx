"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiClient, ApiError } from "@/lib/api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
  isPremium?: boolean;
  isCollegeAdmin?: boolean;
  collegeId?: string | null;
  collegeRollNumber?: string | null;
  tenureStartYear?: number | null;
  tenureEndYear?: number | null;
  isTenureExpired?: boolean;
  createdAt?: string;
}

export interface RegisterOptions {
  name: string;
  email: string;
  password: string;
  accountType?: "USER" | "COLLEGE_ADMIN";
  collegeName?: string;
  officialCollegeEmail?: string;
  expectedStudents?: number;
  department?: string;
  collegeCode?: string;
  rollNumber?: string;
  tenureStartYear?: number;
  tenureEndYear?: number;
}

interface AuthResponse {
  user: User;
  message: string;
  token?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
    loginAs?: "USER" | "COLLEGE_ADMIN"
  ) => Promise<User>;
  register: (
    nameOrOptions: string | RegisterOptions,
    email?: string,
    password?: string
  ) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  upgradeToPremium: () => Promise<User>;
  togglePremium: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize cached user from localStorage immediately on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("katasphere_user");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object" && parsed.email) {
          setUser(parsed);
          setIsLoading(false);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("katasphere_token") : null;
    const cachedUser = typeof window !== "undefined" ? localStorage.getItem("katasphere_user") : null;

    try {
      // 4000ms max timeout so auth check never hangs the page
      const response = await apiClient<ApiResponse<User>>("/api/v1/auth/me", { timeoutMs: 4000 });
      if (response && response.data) {
        setUser(response.data);
        try {
          localStorage.setItem("katasphere_user", JSON.stringify(response.data));
        } catch {}
      } else {
        // If server returned data: null, only clear if there is no token/user cached in localStorage
        if (!token && !cachedUser) {
          setUser(null);
          try {
            localStorage.removeItem("katasphere_user");
          } catch {}
        }
      }
    } catch (err: any) {
      // Only clear user on explicit 401 Unauthorized
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        try {
          localStorage.removeItem("katasphere_user");
          localStorage.removeItem("katasphere_token");
        } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (
    email: string,
    password: string,
    rememberMe = false,
    loginAs?: "USER" | "COLLEGE_ADMIN"
  ): Promise<User> => {
    const response = await apiClient<ApiResponse<AuthResponse>>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe, loginAs }),
    });

    const loggedInUser = response.data.user;
    const token = response.data.token;
    setUser(loggedInUser);
    try {
      if (token) {
        localStorage.setItem("katasphere_token", token);
      }
      localStorage.setItem("katasphere_user", JSON.stringify(loggedInUser));
    } catch {}
    return loggedInUser;
  };

  const register = async (
    nameOrOptions: string | RegisterOptions,
    email?: string,
    password?: string
  ): Promise<User> => {
    const payload: RegisterOptions =
      typeof nameOrOptions === "string"
        ? { name: nameOrOptions, email: email || "", password: password || "", accountType: "USER" }
        : nameOrOptions;

    const response = await apiClient<ApiResponse<AuthResponse>>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const registeredUser = response.data.user;
    const token = response.data.token;
    setUser(registeredUser);
    try {
      if (token) {
        localStorage.setItem("katasphere_token", token);
      }
      localStorage.setItem("katasphere_user", JSON.stringify(registeredUser));
    } catch {}
    return registeredUser;
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      try {
        localStorage.removeItem("katasphere_token");
        localStorage.removeItem("katasphere_user");
      } catch {}
    }
  };

  const upgradeToPremium = async (): Promise<User> => {
    const response = await apiClient<ApiResponse<User>>("/api/v1/users/upgrade-premium", {
      method: "POST",
    });
    const updatedUser = response.data;
    setUser(updatedUser);
    try {
      localStorage.setItem("katasphere_user", JSON.stringify(updatedUser));
    } catch {}
    return updatedUser;
  };

  const togglePremium = async (): Promise<User> => {
    const response = await apiClient<ApiResponse<User>>("/api/v1/users/toggle-premium", {
      method: "POST",
    });
    const updatedUser = response.data;
    setUser(updatedUser);
    try {
      localStorage.setItem("katasphere_user", JSON.stringify(updatedUser));
    } catch {}
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser, upgradeToPremium, togglePremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
