"use client";

import { useState } from "react";
import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";

const INVOICES = [
  { id: "INV-1042", date: "Jun 1, 2026", amount: "$499.00", status: "Paid" },
  { id: "INV-1038", date: "May 1, 2026", amount: "$499.00", status: "Paid" },
  { id: "INV-1031", date: "Apr 1, 2026", amount: "$499.00", status: "Paid" },
  { id: "INV-1024", date: "Mar 1, 2026", amount: "$349.00", status: "Paid" },
];

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
            {mode === "sub" ? "Growth" : "Pay per lead"}
          </div>
          <div style={{ fontSize: 14, color: "rgba(234,240,249,0.6)", marginBottom: 20 }}>
            {mode === "sub" ? "$499/mo — up to 25 leads/mo" : "$65 per qualified lead — no commitment"}
          </div>
          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-gold btn-sm">Change plan</button>
            <button className="btn btn-ghost-light btn-sm">Cancel</button>
          </div>
        </div>

        {/* payment method */}
        <div className="card" style={{ padding: "28px 30px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
            Payment method
          </div>
          <div className="row" style={{ gap: 14, marginBottom: 18 }}>
            <div
              style={{
                width: 48,
                height: 32,
                borderRadius: 6,
                background: "var(--pine)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="card" size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 650, fontSize: 14.5, color: "var(--ink)" }}>Visa ending 4242</div>
              <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>Expires 09/2028</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm">Update card</button>
        </div>
      </div>

      {/* invoices table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Invoices</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left" }}>
              {["Invoice", "Date", "Amount", "Status", ""].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 24px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: "1px solid var(--line)" }}>
                <td style={{ padding: "14px 24px", fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                  {inv.id}
                </td>
                <td style={{ padding: "14px 24px", fontSize: 13.5, color: "var(--text-2)" }}>
                  {inv.date}
                </td>
                <td style={{ padding: "14px 24px" }}>
                  <span className="mono" style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                    {inv.amount}
                  </span>
                </td>
                <td style={{ padding: "14px 24px" }}>
                  <span
                    className="pill"
                    style={{
                      fontSize: 11.5,
                      padding: "4px 12px",
                      background: "var(--verified-tint)",
                      color: "var(--verified)",
                    }}
                  >
                    {inv.status}
                  </span>
                </td>
                <td style={{ padding: "14px 24px", textAlign: "right" }}>
                  <button className="row" style={{ gap: 6, fontSize: 13, fontWeight: 600, color: "var(--signal)" }}>
                    <Icon name="download" size={15} />
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
