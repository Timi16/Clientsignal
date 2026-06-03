"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function LoginChooser() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--paper)",
        padding: "40px 20px",
      }}
    >
      <div
        className="rise"
        style={{
          width: "100%",
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        {/* Logo */}
        <Link href="/" aria-label="Go to home">
          <Logo size={32} />
        </Link>

        {/* Heading */}
        <div style={{ textAlign: "center" }}>
          <h1
            className="display"
            style={{ fontSize: 30, color: "var(--ink)", marginBottom: 8 }}
          >
            Log in
          </h1>
          <p style={{ fontSize: 15.5, color: "var(--text-2)", lineHeight: 1.5 }}>
            Choose your account type to continue.
          </p>
        </div>

        {/* Option cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
          }}
        >
          {/* Client login */}
          <button
            onClick={() => router.push("/client/login")}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "22px 24px",
              cursor: "pointer",
              textAlign: "left",
              transition: "transform .2s var(--ease), box-shadow .2s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--sh-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "var(--blue-tint)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="user" size={26} color="var(--signal)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16.5,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                Client login
              </div>
              <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.45 }}>
                Track your case, upload documents, and message your attorney.
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--signal-tint)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="arrowR" size={18} color="var(--signal)" />
            </div>
          </button>

          {/* Attorney login */}
          <button
            onClick={() => router.push("/attorney/login")}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "22px 24px",
              cursor: "pointer",
              textAlign: "left",
              transition: "transform .2s var(--ease), box-shadow .2s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--sh-md)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "var(--signal-tint)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="shield" size={26} color="var(--signal)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16.5,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                Attorney login
              </div>
              <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.45 }}>
                Access your lead dashboard, analytics, and firm settings.
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--signal-tint)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="arrowR" size={18} color="var(--signal)" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 14, color: "var(--text-3)" }}>
          New to ClientSignal?{" "}
          <button
            onClick={() => router.push("/get-started")}
            style={{
              color: "var(--signal)",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Get started
          </button>
        </p>
      </div>
    </div>
  );
}
