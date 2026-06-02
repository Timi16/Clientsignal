"use client";

import { useRouter } from "next/navigation";
import { Logo, Avatar, Verified, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

/* ---------- AuthShell: shared left brand panel for attorney/admin ---------- */
function AuthBrandPanel({ variant = "attorney" }: { variant?: "attorney" | "internal" }) {
  const isInternal = variant === "internal";

  return (
    <div
      className="auth-brand gridlines"
      style={{
        position: "relative",
        background: "var(--pine)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "44px 40px 40px",
        minHeight: "100vh",
      }}
    >
      {/* Radial gradient circle */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-30%",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Logo light size={30} sub />
      </div>

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 32, maxWidth: 400 }}>
        {isInternal ? (
          <>
            {/* Lock icon */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(255,255,255,0.07)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="lock" size={28} color="rgba(234,240,249,0.7)" />
            </div>
            <div>
              <h2
                className="display"
                style={{ fontSize: 32, color: "#fff", marginBottom: 12 }}
              >
                Operations console.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(234,240,249,0.55)" }}>
                Internal-only access to attorney verifications, lead quality control, revenue tracking, and platform administration.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Quote */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 64,
                  fontFamily: "var(--serif)",
                  color: "var(--gold-soft)",
                  lineHeight: 1,
                  marginBottom: -12,
                  opacity: 0.5,
                }}
              >
                &ldquo;
              </div>
              <p
                className="serif"
                style={{
                  fontSize: 19,
                  lineHeight: 1.55,
                  color: "rgba(234,240,249,0.88)",
                  fontStyle: "italic",
                }}
              >
                We respond to matched leads in under four minutes. ClientSignal paid for itself in the first week — the lead quality is simply better.
              </p>
            </div>
            {/* Author */}
            <div className="row" style={{ gap: 12 }}>
              <Avatar name="Sarah Mitchell" size={42} />
              <div>
                <div className="row" style={{ gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 14.5, color: "#fff" }}>
                    Sarah Mitchell
                  </span>
                  <Verified size={15} />
                </div>
                <span style={{ fontSize: 13, color: "rgba(234,240,249,0.5)" }}>
                  Partner, Mitchell &amp; Cole LLP
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats row */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          gap: 32,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 24,
        }}
      >
        {isInternal ? (
          <>
            <StatItem value="2,412" label="Active attorneys" />
            <StatItem value="8,412" label="Leads / mo" />
            <StatItem value="$486K" label="Revenue MTD" />
          </>
        ) : (
          <>
            <StatItem value="2,400+" label="Verified attorneys" />
            <StatItem value="98%" label="Lead acceptance" />
            <StatItem value="~4 min" label="Median response" />
          </>
        )}
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="mono"
        style={{ fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "rgba(234,240,249,0.45)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function AttorneyLogin() {
  const router = useRouter();

  return (
    <div
      className="auth-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.05fr",
        minHeight: "100vh",
      }}
    >
      {/* Left brand panel */}
      <AuthBrandPanel variant="attorney" />

      {/* Right form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          background: "var(--paper)",
          overflowY: "auto",
        }}
      >
        <div
          className="rise"
          style={{
            width: "100%",
            maxWidth: 420,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {/* Pill */}
          <span
            className="pill"
            style={{
              background: "var(--signal-tint)",
              color: "var(--signal)",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--signal)",
              }}
            />
            Attorney portal
          </span>

          {/* Heading */}
          <div>
            <h1
              className="display"
              style={{ fontSize: 32, color: "var(--ink)", marginBottom: 8 }}
            >
              Welcome back.
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-2)" }}>
              Sign in to your attorney dashboard.
            </p>
          </div>

          {/* Form */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <Field label="Email address" type="email" placeholder="you@firm.com" icon="mail" />
            <Field label="Password" type="password" placeholder="Enter your password" icon="lock" />

            {/* Remember + forgot */}
            <div
              className="row between"
              style={{ marginTop: -4 }}
            >
              <label
                className="row"
                style={{ gap: 8, fontSize: 13.5, color: "var(--text-2)", cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    accentColor: "var(--signal)",
                    cursor: "pointer",
                  }}
                />
                Remember me
              </label>
              <button
                style={{
                  fontSize: 13.5,
                  color: "var(--signal)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Log in button */}
            <button
              className="btn btn-signal btn-lg"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => router.push("/attorney/dashboard")}
            >
              Log in
              <Icon name="arrowR" size={17} color="#fff" />
            </button>
          </div>

          {/* Create account link */}
          <p
            style={{
              fontSize: 14,
              color: "var(--text-3)",
              textAlign: "center",
            }}
          >
            New to ClientSignal?{" "}
            <button
              onClick={() => router.push("/attorney/signup")}
              style={{
                color: "var(--signal)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Create an attorney account
            </button>
          </p>

          {/* Client-side box */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 12,
              background: "var(--pine-tint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 13.5, color: "var(--text-2)" }}>
              Looking for legal help?{" "}
              <button
                onClick={() => router.push("/for-clients")}
                style={{
                  fontWeight: 600,
                  color: "var(--signal)",
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                go to the client side &rarr;
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
