"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo, Avatar, Verified, Field, LField, inpStyle } from "@/components/ui";
import { Icon } from "@/components/icons";

/* ---------- AuthBrandPanel (attorney variant) ---------- */
function AuthBrandPanel() {
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

      <Link href="/" aria-label="Go to home" style={{ position: "relative", zIndex: 1, display: "flex", alignSelf: "flex-start" }}>
        <Logo light size={30} sub />
      </Link>

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 32, maxWidth: 400 }}>
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
        <StatItem value="2,400+" label="Verified attorneys" />
        <StatItem value="98%" label="Lead acceptance" />
        <StatItem value="~4 min" label="Median response" />
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

export default function AttorneySignup() {
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
      <AuthBrandPanel />

      {/* Right form */}
      <div
        className="thin-scroll"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "48px 40px",
          background: "var(--paper)",
          overflowY: "auto",
          height: "100vh",
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
            margin: "auto 0",
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
            Join as a verified attorney
          </span>

          {/* Heading */}
          <div>
            <h1
              className="display"
              style={{ fontSize: 32, color: "var(--ink)", marginBottom: 8 }}
            >
              Create your firm account.
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-2)" }}>
              Start receiving pre-qualified, exclusive leads in minutes.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Full name" placeholder="Jane Smith" icon="user" />
            <Field label="Firm name" placeholder="Smith & Associates LLP" icon="building" />
            <Field label="Email address" type="email" placeholder="you@firm.com" icon="mail" />
            <Field label="Bar number" placeholder="TX #123456" icon="shield" />

            {/* State select */}
            <LField label="State of licensure">
              <select
                style={{
                  ...inpStyle,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  paddingRight: 40,
                }}
                defaultValue=""
              >
                <option value="" disabled>
                  Select state
                </option>
                <option>Texas</option>
                <option>California</option>
                <option>New York</option>
                <option>Florida</option>
                <option>Georgia</option>
                <option>Arizona</option>
                <option>Washington</option>
                <option>Colorado</option>
                <option>Illinois</option>
                <option>Other</option>
              </select>
            </LField>

            <Field label="Password" type="password" placeholder="Create a strong password" icon="lock" />

            {/* Submit */}
            <button
              className="btn btn-signal btn-lg"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => router.push("/attorney/onboard")}
            >
              Create account &amp; continue
              <Icon name="arrowR" size={17} color="#fff" />
            </button>
          </div>

          {/* Login link */}
          <p
            style={{
              fontSize: 14,
              color: "var(--text-3)",
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <button
              onClick={() => router.push("/attorney/login")}
              style={{
                color: "var(--signal)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
