"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo, Field } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function ClientSignup() {
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
        <Link href="/" aria-label="Go to home" style={{ position: "absolute", top: 44, left: 40, zIndex: 1 }}>
          <Logo light size={30} sub />
        </Link>

        {/* Bottom text */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 380 }}>
          <h2
            className="display"
            style={{ fontSize: 38, color: "#fff", marginBottom: 14, lineHeight: 1.08 }}
          >
            Get the help you need.
          </h2>
          <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.55,
              color: "rgba(234,240,249,0.6)",
            }}
          >
            Create a free account to get matched with a verified attorney, track your case progress, and communicate securely.
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
          {/* Pill */}
          <span
            className="pill"
            style={{
              background: "var(--gold-tint)",
              color: "var(--gold-text)",
              alignSelf: "flex-start",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--gold)",
              }}
            />
            Free for clients
          </span>

          {/* Heading */}
          <div>
            <h1
              className="display"
              style={{ fontSize: 32, color: "var(--ink)", marginBottom: 8 }}
            >
              Create your account.
            </h1>
            <p style={{ fontSize: 15, color: "var(--text-2)" }}>
              It only takes a minute. No cost, ever.
            </p>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Full name" placeholder="Jane Smith" icon="user" />
            <Field
              label="Email address"
              type="email"
              placeholder="you@email.com"
              icon="mail"
            />
            <Field
              label="Phone number"
              type="tel"
              placeholder="(555) 123-4567"
              icon="phone"
            />
            <Field
              label="Password"
              type="password"
              placeholder="Create a password"
              icon="lock"
            />

            {/* Terms */}
            <label
              className="row"
              style={{
                gap: 8,
                fontSize: 13,
                color: "var(--text-2)",
                cursor: "pointer",
                lineHeight: 1.4,
                alignItems: "flex-start",
              }}
            >
              <input
                type="checkbox"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  accentColor: "var(--signal)",
                  cursor: "pointer",
                  marginTop: 2,
                  flexShrink: 0,
                }}
              />
              <span>
                I agree to the{" "}
                <span style={{ color: "var(--signal)", fontWeight: 600 }}>
                  Terms of Service
                </span>{" "}
                and{" "}
                <span style={{ color: "var(--signal)", fontWeight: 600 }}>
                  Privacy Policy
                </span>
              </span>
            </label>

            {/* Create account */}
            <button
              className="btn btn-signal btn-lg"
              style={{ width: "100%", marginTop: 4 }}
              onClick={() => router.push("/client/dashboard")}
            >
              Create account
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
              onClick={() => router.push("/client/login")}
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
