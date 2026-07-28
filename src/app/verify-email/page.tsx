"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";
import * as authApi from "@/lib/api/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const verifyAttempted = useRef(false);

  const token = searchParams.get("token");

  // Auto-verify when token is in URL
  useEffect(() => {
    if (!token || verifyAttempted.current) return;
    verifyAttempted.current = true;
    setVerifying(true);
    authApi
      .verifyEmail(token)
      .then(async () => {
        await refresh();
        const updated = authApi.currentUser();
        const dest =
          updated?.role === "attorney"
            ? "/attorney/onboard"
            : updated?.role === "admin"
              ? "/admin"
              : "/client/dashboard";
        router.replace(dest);
      })
      .catch(() => {
        setError("Verification failed — the link may be expired. Try resending.");
        setVerifying(false);
      });
  }, [token, refresh, router]);

  // If already verified, redirect
  if (user?.emailVerifiedAt) {
    const dest = user.role === "attorney" ? "/attorney/onboard" : user.role === "admin" ? "/admin" : "/client/dashboard";
    router.replace(dest);
    return null;
  }

  if (verifying) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", padding: "40px 20px" }}>
        <div className="rise" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, textAlign: "center" }}>
          <Logo size={32} />

          {/* Animated ring */}
          <div style={{ position: "relative", width: 80, height: 80 }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ animation: "verify-spin 1.2s ease-in-out infinite" }}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--signal)" strokeWidth="4" strokeLinecap="round" strokeDasharray="160" strokeDashoffset="120" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <Icon name="check" size={28} color="var(--signal)" style={{ opacity: 0.5 }} />
            </div>
          </div>

          <div>
            <h1 className="display" style={{ fontSize: 26, color: "var(--ink)", marginBottom: 8 }}>Verifying your email</h1>
            <p style={{ fontSize: 14.5, color: "var(--text-2)" }}>Hang tight, this only takes a moment...</p>
          </div>

          <style>{`@keyframes verify-spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await authApi.resendVerification();
      setResent(true);
    } catch {
      setError("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      await refresh();
      const updated = authApi.currentUser();
      if (updated?.emailVerifiedAt) {
        const dest = updated.role === "attorney" ? "/attorney/onboard" : updated.role === "admin" ? "/admin" : "/client/dashboard";
        router.replace(dest);
      } else {
        setError("Email not verified yet. Please check your inbox.");
        setTimeout(() => setError(""), 3000);
      }
    } catch {
      setError("Could not check status. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", padding: "40px 20px" }}>
      <div className="rise" style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, textAlign: "center" }}>
        <Link href="/" aria-label="Go to home">
          <Logo size={32} />
        </Link>

        {/* Mail icon */}
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "var(--signal-tint)", display: "grid", placeItems: "center" }}>
          <Icon name="mail" size={42} color="var(--signal)" />
        </div>

        <div>
          <h1 className="display" style={{ fontSize: 30, color: "var(--ink)", marginBottom: 10 }}>
            Check your email
          </h1>
          <p style={{ fontSize: 15.5, color: "var(--text-2)", lineHeight: 1.55, maxWidth: 380, margin: "0 auto" }}>
            We sent a verification link to{" "}
            <strong style={{ color: "var(--ink)" }}>{user?.email || "your email"}</strong>.
            Click the link to verify your account and get started.
          </p>
        </div>

        {/* Steps */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { step: "1", text: "Open the email from ClientSignal", icon: "mail" },
            { step: "2", text: "Click the verification link", icon: "arrowR" },
            { step: "3", text: "You're in — redirected automatically", icon: "check" },
          ].map((s) => (
            <div key={s.step} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--signal-tint)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--signal)" }}>{s.step}</span>
              </div>
              <span style={{ fontSize: 14.5, color: "var(--text-1)", fontWeight: 500 }}>{s.text}</span>
              <Icon name={s.icon} size={16} color="var(--text-3)" style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: "10px 16px", borderRadius: 8, background: "var(--coral-tint)", color: "var(--coral)", fontSize: 13.5, fontWeight: 500, width: "100%" }}>
            {error}
          </div>
        )}

        {resent && !error && (
          <div style={{ padding: "10px 16px", borderRadius: 8, background: "var(--verified-tint)", color: "var(--verified)", fontSize: 13.5, fontWeight: 500, width: "100%" }}>
            Verification email resent. Check your inbox.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          <button className="btn btn-signal btn-lg" style={{ width: "100%" }} onClick={handleCheckStatus}>
            <Icon name="check" size={17} color="#fff" />
            I&apos;ve verified — continue
          </button>

          <button
            className="btn btn-ghost"
            style={{ width: "100%", opacity: resending ? 0.6 : 1 }}
            disabled={resending}
            onClick={handleResend}
          >
            <Icon name="refresh" size={16} />
            {resending ? "Sending..." : "Resend verification email"}
          </button>
        </div>

        <div style={{ padding: "16px 20px", borderRadius: 12, background: "var(--pine-tint)", width: "100%", textAlign: "left" }}>
          <div className="row" style={{ gap: 10 }}>
            <Icon name="mail" size={16} color="var(--text-3)" />
            <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.45 }}>
              Don&apos;t see it? Check your spam folder. The email comes from <strong>admin@clientssignal.com</strong>.
            </span>
          </div>
        </div>

        <p style={{ fontSize: 13.5, color: "var(--text-3)" }}>
          Wrong email?{" "}
          <button onClick={() => { authApi.logout(); router.push("/"); }} style={{ color: "var(--signal)", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
            Sign up again
          </button>
        </p>
      </div>
    </div>
  );
}
