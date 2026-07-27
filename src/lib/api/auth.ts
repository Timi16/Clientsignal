import { post, get, setToken, setUser, getUser, getToken } from "./client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "attorney" | "admin";
  emailVerifiedAt: string;
  disabledAt: string;
  lastLoginAt: string;
  createdAt: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

export async function register(data: {
  email: string;
  name: string;
  password: string;
  role: "client" | "attorney" | "admin";
}): Promise<AuthResponse> {
  const res = await post<AuthResponse>("/auth/register", { body: data });
  setToken(res.accessToken);
  setUser(res.user as unknown as Record<string, unknown>);
  return res;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await post<AuthResponse>("/auth/login", { body: data });
  setToken(res.accessToken);
  setUser(res.user as unknown as Record<string, unknown>);
  return res;
}

export async function logout(): Promise<void> {
  await post("/auth/logout").catch(() => {});
  setToken(null);
  setUser(null);
}

export async function getMe(): Promise<{ user: User }> {
  return get<{ user: User }>("/auth/me");
}

export async function forgotPassword(email: string) {
  return post("/auth/forgot-password", { body: { email } });
}

export async function resetPassword(token: string, newPassword: string) {
  return post("/auth/reset-password", { body: { token, newPassword } });
}

export async function resendVerification() {
  return post("/auth/resend-verification");
}

export function currentUser(): User | null {
  const u = getUser();
  return u as User | null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function currentRole(): string | null {
  return currentUser()?.role ?? null;
}
