"use client";

import { useRouter } from "next/navigation";
import { Logo, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

/* ---------- AuthBrandPanel (internal variant) ---------- */
function AuthBrandPanelInternal() {
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
      {/* Radial gradient */}
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

      <div style={{ position: "relative", zIndex: 1 }}>
        <Logo light size={30} sub />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
          maxWidth: 400,
        }}
      >
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
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(234,240,249,0.55)",
            }}
          >
            Internal-only access to attorney verifications, lead quality control, revenue tracking, and platform administration.
          </p>
        </div>
      </div>

      {/* Stats */}
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
        <StatItem value="2,412" label="Active attorneys" />
        <StatItem value="8,412" label="Leads / mo" />
        <StatItem value="$486K" label="Revenue MTD" />
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontWeight: 700,
          fontSize: 18,
          color: "#fff",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "rgba(234,240,249,0.45)", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}

export default function InternalLogin() {
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
      <AuthBrandPanelInternal />

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
              background: "var(--coral-tint)",
              color: "var(--coral)",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--coral)",
              }}
            />
            Authorized personnel only
          </span>

          {/* Heading */}
          <div>
            <h1
              className="display"
              style={{ fontSize: 32, color: "var(--ink)", marginBottom: 8 }}
            >
              Internal sign-in
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-2)" }}>
              Access is restricted to ClientSignal team members.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field
              label="Email address"
              type="email"
              placeholder="you@clientsignal.com"
              icon="mail"
            />
            <Field
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon="lock"
            />
            <Field
              label="Two-factor code"
              placeholder="000 000"
              icon="shield"
            />

            {/* Sign in button */}
            <button
              className="btn btn-pine btn-lg"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => router.push("/admin")}
            >
              Sign in
              <Icon name="arrowR" size={17} color="#fff" />
            </button>
          </div>

          {/* Note */}
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 10,
              background: "var(--pine-tint)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Icon name="lock" size={16} color="var(--text-3)" />
            <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.45 }}>
              Admin accounts are provisioned manually by the engineering team.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
