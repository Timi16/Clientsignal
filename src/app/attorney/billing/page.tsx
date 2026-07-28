"use client";

import { useState } from "react";
import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";

export default function BillingPage() {
  const [mode, setMode] = useState<"sub" | "ppl">("sub");

  return (
    <AppLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>Billing</h1>

      {/* toggle */}
      <div
        className="row"
        style={{
          gap: 0,
          marginBottom: 28,
          background: "var(--paper)",
          borderRadius: 10,
          padding: 4,
          width: "fit-content",
          border: "1.5px solid var(--line)",
        }}
      >
        <button
          onClick={() => setMode("sub")}
          style={{
            padding: "9px 22px",
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            background: mode === "sub" ? "var(--card)" : "transparent",
            color: mode === "sub" ? "var(--ink)" : "var(--text-3)",
            boxShadow: mode === "sub" ? "var(--sh-sm)" : "none",
            transition: "all .15s",
          }}
        >
          Subscription
        </button>
        <button
          onClick={() => setMode("ppl")}
          style={{
            padding: "9px 22px",
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            background: mode === "ppl" ? "var(--card)" : "transparent",
            color: mode === "ppl" ? "var(--ink)" : "var(--text-3)",
            boxShadow: mode === "ppl" ? "var(--sh-sm)" : "none",
            transition: "all .15s",
          }}
        >
          Pay per lead
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        {/* current plan */}
        <div
          className="card"
          style={{
            padding: "28px 30px",
            background: "var(--pine)",
            color: "#fff",
            border: "none",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gold-soft)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            Current plan
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            {mode === "sub" ? "No plan selected" : "Pay per lead"}
          </div>
          <div style={{ fontSize: 14, color: "rgba(234,240,249,0.6)", marginBottom: 20 }}>
            {mode === "sub" ? "Choose a subscription plan to get started" : "$65 per qualified lead — no commitment"}
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-gold btn-sm">Choose plan</button>
          </div>
        </div>

        {/* payment method */}
        <div className="card" style={{ padding: "28px 30px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            Payment method
          </div>
          <div style={{ display: "grid", placeItems: "center", padding: "20px 0" }}>
            <div className="stack" style={{ alignItems: "center", gap: 10 }}>
              <Icon name="card" size={28} color="var(--text-3)" />
              <p style={{ fontSize: 14, color: "var(--text-3)" }}>No payment method on file</p>
              <button className="btn btn-ghost btn-sm">Add card</button>
            </div>
          </div>
        </div>
      </div>

      {/* invoices table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Invoices</h3>
        </div>
        <div style={{ padding: 40, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>No invoices yet. Invoices will appear here once your billing is active.</p>
        </div>
      </div>
    </AppLayout>
  );
}
