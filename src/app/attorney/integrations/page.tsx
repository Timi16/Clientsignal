"use client";

import { useState } from "react";
import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";
import { INTEGRATIONS } from "@/lib/data";

export default function IntegrationsPage() {
  const [items, setItems] = useState(
    INTEGRATIONS.map((i) => ({ ...i }))
  );

  const toggle = (name: string) =>
    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, connected: !i.connected } : i))
    );

  return (
    <AppLayout>
      {/* header card */}
      <div
        className="card"
        style={{
          padding: "36px 36px",
          background: "var(--pine)",
          color: "#fff",
          border: "none",
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div style={{ position: "relative" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Connect your stack</h1>
          <p style={{ fontSize: 15, color: "rgba(234,240,249,0.65)", maxWidth: 520, lineHeight: 1.6 }}>
            Integrate ClientSignal with the tools you already use. Sync leads, automate intake, and keep your workflow seamless.
          </p>
        </div>
      </div>

      {/* integration grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
        {items.map((intg) => (
          <div key={intg.name} className="card" style={{ padding: "24px 24px" }}>
            <div className="row" style={{ gap: 14, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: intg.color,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name="plug" size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>{intg.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>{intg.cat}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 18 }}>
              {intg.desc}
            </p>
            <button
              onClick={() => toggle(intg.name)}
              className={`btn btn-sm ${intg.connected ? "btn-ghost" : "btn-signal"}`}
              style={{ width: "100%" }}
            >
              {intg.connected ? (
                <>
                  <Icon name="check" size={15} />
                  Connected
                </>
              ) : (
                <>
                  <Icon name="plug" size={15} />
                  Connect
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
