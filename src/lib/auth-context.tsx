"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import * as authApi from "./api/auth";
import type { User } from "./api/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, name: string, password: string, role: "client" | "attorney" | "admin") => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = authApi.currentUser();
    if (saved) {
      setUser(saved);
      // Verify token is still valid
      authApi.getMe()
        .then((res) => setUser(res.user))
        .catch(() => {
          setUser(null);
          authApi.logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (email: string, name: string, password: string, role: "client" | "attorney" | "admin") => {
    const res = await authApi.register({ email, name, password, role });
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.user);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
