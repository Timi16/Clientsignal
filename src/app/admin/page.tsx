"use client";

import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/ui";
import { ATTORNEYS } from "@/lib/data";

export default function AdminOverview() {
  const router = useRouter();
  return (
    <AdminLayout title="Operations overview">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 26 }} className="stat-grid">
        {([["Pending verifications", "2", "var(--amber)", "shield"], ["Leads in QA", "3", "var(--coral)", "flag"], ["Active attorneys", "2,412", "var(--verified)", "user"], ["Revenue (MTD)", "$486K", "var(--pine)", "dollar"]] as [string, string, string, string][]).map(([l, v, c, ic]) => (
          <div key={l} className="card" style={{ padding: 24, minHeight: 144, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div className="row between" style={{ marginBottom: 16 }}><span className="eyebrow" style={{ fontSize: 10.5 }}>{l}</span><span style={{ color: c }}><Icon name={ic} size={18} /></span></div>
            <strong className="mono" style={{ fontSize: 30, color: c }}>{v}</strong>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="dash-grid">
        <div className="card" style={{ padding: 26, minHeight: 332 }}>
          <div className="row between" style={{ marginBottom: 20 }}><strong style={{ fontSize: 16 }}>Verification queue</strong><button onClick={() => router.push("/admin/verify")} className="row gap-1" style={{ fontSize: 13, color: "var(--pine)", fontWeight: 600 }}>Review all <Icon name="arrowR" size={15} /></button></div>
          <div className="stack" style={{ gap: 14 }}>
            {ATTORNEYS.filter(a => a.status !== "approved").map(a => (
              <div key={a.name} className="row between" style={{ padding: 18, minHeight: 76, borderRadius: 12, border: "1px solid var(--line)" }}>
                <div className="row" style={{ gap: 11 }}><Avatar name={a.name} size={38} /><div className="stack" style={{ gap: 2 }}><strong style={{ fontSize: 14 }}>{a.name}</strong><span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{a.bar}</span></div></div>
                <span className="pill" style={{ background: "var(--amber-tint)", color: "var(--amber)", fontSize: 11, padding: "4px 10px" }}><Icon name="clock" size={12} /> 18h left</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 26, minHeight: 332 }}>
          <strong style={{ fontSize: 16, display: "block", marginBottom: 20 }}>Platform activity</strong>
          <div className="stack" style={{ gap: 18 }}>
            {([["New attorney approved", "Renee Adams · GA", "var(--verified)", "check"], ["Lead flagged for QA", "LD-4471 · injury", "var(--coral)", "flag"], ["Subscription started", "Park Immigration · Firm plan", "var(--pine)", "dollar"], ["Lead refunded", "LD-4402 · duplicate", "var(--amber)", "refresh"]] as [string, string, string, string][]).map(([t, s, c, ic], i) => (
              <div key={i} className="row" style={{ gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--paper-2)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={ic} size={16} color={c} /></div>
                <div className="stack" style={{ gap: 1 }}><strong style={{ fontSize: 13.5 }}>{t}</strong><span style={{ fontSize: 12, color: "var(--text-3)" }}>{s}</span></div>
                <span className="mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-3)" }}>{["2m", "14m", "1h", "3h"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
