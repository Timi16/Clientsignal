"use client";

import { useRouter } from "next/navigation";
import { Logo, ChooserArt } from "@/components/ui";
import { Icon } from "@/components/icons";

export default function GetStarted() {
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
        <Logo size={32} />

        {/* Heading */}
        <div style={{ textAlign: "center" }}>
          <h1
            className="display"
            style={{ fontSize: 30, color: "var(--ink)", marginBottom: 8 }}
          >
            Get started
          </h1>
          <p style={{ fontSize: 15.5, color: "var(--text-2)", lineHeight: 1.5 }}>
            Choose the option that best describes you.
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
          {/* Client card */}
          <button
            onClick={() => router.push("/client/signup")}
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
            <ChooserArt kind="client" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16.5,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                I need legal help
              </div>
              <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.45 }}>
                Get matched with a verified attorney for your situation.
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

          {/* Attorney card */}
          <button
            onClick={() => router.push("/attorney/signup")}
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
            <ChooserArt kind="attorney" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 16.5,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                I&rsquo;m an attorney
              </div>
              <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.45 }}>
                Join the network and start receiving qualified leads.
              </div>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "var(--gold-tint)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Icon name="arrowR" size={18} color="var(--gold-deep)" />
            </div>
          </button>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 14, color: "var(--text-3)" }}>
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
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
  );
}
