"use client";

import { useRouter } from "next/navigation";
import { Logo, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function ClientLogin() {
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
      {/* Left: dark photo panel */}
      <div
        className="auth-brand"
        style={{
          position: "relative",
          background: "var(--pine)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "44px 40px 48px",
          minHeight: "100vh",
        }}
      >
        {/* Background photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=1600&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />

        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(8,20,38,0.95) 0%, rgba(8,20,38,0.6) 40%, rgba(8,20,38,0.4) 100%)",
          }}
        />

        {/* Logo at top */}
        <div style={{ position: "absolute", top: 44, left: 40, zIndex: 1 }}>
          <Logo light size={30} sub />
        </div>

        {/* Bottom text */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 380 }}>
          <h2
            className="display"
            style={{ fontSize: 38, color: "#fff", marginBottom: 14, lineHeight: 1.08 }}
          >
            Track your case.
          </h2>
          <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "rgba(234,240,249,0.6)",
            }}
          >
            Upload documents, message your attorney, and see real-time updates on your legal matter — all in one place.
          </p>
        </div>
      </div>

      {/* Right: form */}
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
          {/* Heading */}
          <div>
            <h1
              className="display"
              style={{ fontSize: 32, color: "var(--ink)", marginBottom: 8 }}
            >
              Welcome back.
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-2)" }}>
              Sign in to your client portal.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field
              label="Email address"
              type="email"
              placeholder="you@email.com"
              icon="mail"
            />
            <Field
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon="lock"
            />

            {/* Remember + forgot */}
            <div className="row between" style={{ marginTop: -4 }}>
              <label
                className="row"
                style={{
                  gap: 8,
                  fontSize: 13.5,
                  color: "var(--text-2)",
                  cursor: "pointer",
                }}
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

            {/* Sign in */}
            <button
              className="btn btn-signal btn-lg"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => router.push("/client/dashboard")}
            >
              Sign in
              <Icon name="arrowR" size={17} color="#fff" />
            </button>

            {/* Text code */}
            <button
              className="btn btn-ghost"
              style={{ width: "100%" }}
              onClick={() => {}}
            >
              <Icon name="phone" size={17} />
              Sign in with a text code
            </button>
          </div>

          {/* Create account */}
          <p
            style={{
              fontSize: 14,
              color: "var(--text-3)",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => router.push("/client/signup")}
              style={{
                color: "var(--signal)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Create a free account &rarr;
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
