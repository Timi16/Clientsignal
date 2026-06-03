"use client";

import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";

const LOG: [string, string, string, string, string][] = [
  ["Alex Reed", "Approved attorney", "Renee Adams (GA #559210)", "10:42", "shield"],
  ["System", "Lead scored & routed", "LD-4471 → Sarah Mitchell", "10:18", "zap"],
  ["Alex Reed", "Refunded lead", "LD-4402 (duplicate)", "09:55", "refresh"],
  ["System", "Subscription charged", "Park Immigration · $649", "09:30", "dollar"],
  ["Mia Chen", "Updated trust rating", "Carlos Ruiz → Yellow", "08:14", "shield"],
  ["System", "SMS alert delivered", "LD-4470 → David Park", "08:02", "bell"],
  ["Alex Reed", "Removed lead from routing", "LD-4399 (out of jurisdiction)", "Yesterday", "flag"],
  ["System", "Payout processed", "Stripe · $48,210 to firms", "Yesterday", "dollar"],
];

export default function AdminAudit() {
  return (
    <AdminLayout title="Audit log" action={<button className="btn btn-ghost btn-sm"><Icon name="download" size={15} /> Export CSV</button>}>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row between" style={{ padding: "16px 22px", borderBottom: "1px solid var(--line)" }}><strong style={{ fontSize: 15 }}>Activity · all personnel &amp; system events</strong><span style={{ fontSize: 12.5, color: "var(--text-3)" }}>June 1, 2026</span></div>
        {LOG.map((r, i) => (
          <div key={i} className="row" style={{ padding: "14px 22px", borderBottom: i < LOG.length - 1 ? "1px solid var(--line)" : "none", gap: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: r[0] === "System" ? "var(--blue-tint)" : "var(--paper-2)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={r[4]} size={16} color={r[0] === "System" ? "var(--signal)" : "var(--pine)"} /></div>
            <div className="stack" style={{ gap: 2, flex: 1 }}><span style={{ fontSize: 14 }}><strong>{r[0]}</strong> · {r[1]}</span><span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{r[2]}</span></div>
            <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{r[3]}</span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
