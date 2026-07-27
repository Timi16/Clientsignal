const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOpts {
  body?: unknown;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super(typeof data === "object" && data && "message" in data ? String((data as Record<string, unknown>).message) : `HTTP ${status}`);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cs_token");
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("cs_token", token);
  else localStorage.removeItem("cs_token");
}

function getUser(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("cs_user");
  return raw ? JSON.parse(raw) : null;
}

function setUser(user: Record<string, unknown> | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem("cs_user", JSON.stringify(user));
  else localStorage.removeItem("cs_user");
}

async function request<T = unknown>(method: Method, path: string, opts?: RequestOpts): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (opts?.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v) url.searchParams.set(k, v);
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...opts?.headers,
  };

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    credentials: "include",
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });

  if (res.status === 401) {
    // Try refresh
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getToken()}`;
      const retry = await fetch(url.toString(), {
        method,
        headers,
        credentials: "include",
        body: opts?.body ? JSON.stringify(opts.body) : undefined,
      });
      if (!retry.ok) throw new ApiError(retry.status, await retry.json().catch(() => null));
      return retry.json() as Promise<T>;
    }
    // Refresh failed — clear auth
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new ApiError(401, { message: "Session expired" });
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, data);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

let refreshing: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    try {
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return false;
      const data = await res.json();
      setToken(data.accessToken);
      setUser(data.user);
      return true;
    } catch {
      return false;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

export { request, getToken, setToken, getUser, setUser, ApiError, BASE };
export const get = <T = unknown>(path: string, opts?: RequestOpts) => request<T>("GET", path, opts);
export const post = <T = unknown>(path: string, opts?: RequestOpts) => request<T>("POST", path, opts);
export const put = <T = unknown>(path: string, opts?: RequestOpts) => request<T>("PUT", path, opts);
export const del = <T = unknown>(path: string, opts?: RequestOpts) => request<T>("DELETE", path, opts);
