"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo } from "@/components/ui";

const STEPS = [
  { label: "Submitted", status: "done" },
  { label: "Under review", status: "done" },
  { label: "Approved", status: "pending" },
];

export default function VerifyStatusPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--pine-deep)",
        display: "grid",
        placeItems: "center",
        padding: 40,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", textAlign: "center", maxWidth: 480 }}>
        {/* logo */}
        <Link href="/" aria-label="Go to home" style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
          <Logo light size={30} sub />
        </Link>

        {/* clock icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--amber-tint)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 24px",
          }}
        >
          <Icon name="clock" size={32} color="var(--amber)" />
        </div>

        {/* under review pill */}
        <span
          className="pill"
          style={{
            background: "var(--amber-tint)",
            color: "var(--amber)",
            fontSize: 13,
            padding: "6px 16px",
            marginBottom: 20,
            display: "inline-flex",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber)" }} />
          Under review
        </span>

        {/* heading */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#fff",
            marginBottom: 12,
            marginTop: 20,
          }}
        >
          Verification in progress.
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "rgba(234,240,249,0.55)",
            lineHeight: 1.65,
            marginBottom: 40,
          }}
        >
          We're reviewing your licence and firm details. This typically takes 1-2 business days.
          You'll receive an email as soon as your account is approved.
        </p>

        {/* 3-step progress */}
        <div
          className="row"
          style={{
            justifyContent: "center",
            gap: 0,
            marginBottom: 48,
          }}
        >
          {STEPS.map((s, i) => (
            <div key={s.label} className="row" style={{ gap: 0 }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background:
                      s.status === "done"
                        ? "var(--signal)"
                        : "rgba(255,255,255,0.08)",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 8px",
                    border:
                      s.status === "pending"
                        ? "2px dashed rgba(255,255,255,0.2)"
                        : "none",
                  }}
                >
                  {s.status === "done" ? (
                    <Icon name="check" size={18} color="#fff" stroke={2.5} />
                  ) : (
                    <Icon name="clock" size={18} color="rgba(255,255,255,0.35)" />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color:
                      s.status === "done"
                        ? "var(--signal-glow)"
                        : "rgba(234,240,249,0.35)",
                  }}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: 60,
                    height: 2,
                    background:
                      STEPS[i + 1].status === "done"
                        ? "var(--signal)"
                        : "rgba(255,255,255,0.1)",
                    margin: "0 12px",
                    marginBottom: 20,
                    borderRadius: 2,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* preview button */}
        <button
          className="btn btn-signal btn-lg"
          onClick={() => router.push("/attorney/dashboard")}
        >
          Preview my dashboard
          <Icon name="arrowR" size={18} />
        </button>
      </div>
    </div>
  );
}
