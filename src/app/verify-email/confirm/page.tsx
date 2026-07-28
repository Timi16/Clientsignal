"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";
import * as authApi from "@/lib/api/auth";

export default function VerifyEmailConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Missing verification token.");
      return;
    }

    let cancelled = false;
    authApi.verifyEmail(token)
      .then(async () => {
        if (cancelled) return;
        setStatus("success");
        // Refresh user data so emailVerifiedAt is updated
        await refresh();
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Verification failed. The link may have expired.");
      });
    return () => { cancelled = true; };
  }, [token, refresh]);

  const getDestination = () => {
    if (!user) return "/login";
    if (user.role === "attorney") return "/attorney/onboard";
    if (user.role === "admin") return "/admin";
    return "/client/dashboard";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", padding: "40px 20px" }}>
      <div className="rise" style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
        <Link href="/" aria-label="Go to home">
          <Logo size={32} />
        </Link>

        {status === "verifying" && (
          <>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--signal-tint)", display: "grid", placeItems: "center" }}>
              <Icon name="refresh" size={36} color="var(--signal)" />
            </div>
            <h1 className="display" style={{ fontSize: 28, color: "var(--ink)" }}>Verifying your email...</h1>
            <p style={{ fontSize: 15, color: "var(--text-2)" }}>Hang tight, this only takes a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--verified-tint)", display: "grid", placeItems: "center" }}>
              <Icon name="check" size={40} color="var(--verified)" stroke={2.5} />
            </div>
            <h1 className="display" style={{ fontSize: 28, color: "var(--ink)" }}>Email verified!</h1>
            <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.5 }}>
              Your account is confirmed. You&apos;re all set to get started.
            </p>
            <button className="btn btn-signal btn-lg" style={{ width: "100%", marginTop: 8 }} onClick={() => router.push(getDestination())}>
              Continue to {user?.role === "attorney" ? "onboarding" : "dashboard"}
              <Icon name="arrowR" size={17} color="#fff" />
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--coral-tint)", display: "grid", placeItems: "center" }}>
              <Icon name="x" size={40} color="var(--coral)" />
            </div>
            <h1 className="display" style={{ fontSize: 28, color: "var(--ink)" }}>Verification failed</h1>
            <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.5 }}>
              {errorMsg}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <button className="btn btn-signal btn-lg" style={{ width: "100%" }} onClick={() => router.push("/verify-email")}>
                <Icon name="refresh" size={17} color="#fff" />
                Try again
              </button>
              <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => router.push("/login")}>
                Back to login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
