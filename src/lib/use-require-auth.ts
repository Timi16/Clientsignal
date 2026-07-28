"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

/**
 * Redirects to login if not authenticated or wrong role.
 * Returns { user, loading } — render a loading state while loading is true.
 */
export function useRequireAuth(requiredRole?: "client" | "attorney" | "admin") {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const loginPath = requiredRole === "admin" ? "/admin/login"
        : requiredRole === "attorney" ? "/attorney/login"
        : "/client/login";
      router.replace(loginPath);
      return;
    }
    // Redirect unverified users to verification page (skip for admins)
    if (!user.emailVerifiedAt && user.role !== "admin") {
      router.replace("/verify-email");
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      const redirectPath = user.role === "admin" ? "/admin"
        : user.role === "attorney" ? "/attorney/dashboard"
        : "/client/dashboard";
      router.replace(redirectPath);
    }
  }, [user, loading, requiredRole, router]);

  return { user, loading };
}
