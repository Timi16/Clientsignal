"use client";

import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { Bars } from "@/components/ui";

export default function AdminRevenue() {
  return (
    <AdminLayout title="Revenue" action={<span className="pill" style={{ background: "var(--pine-tint)", color: "var(--pine)" }}>Stripe connected</span>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }} className="stat-grid">
        {([["MRR", "$182K", "+9%"], ["Pay-per-lead (MTD)", "$304K", "+24%"], ["Active subscriptions", "1,847", "+3%"], ["Avg revenue / attorney", "$201", "+6%"]] as [string, string, string][]).map(([l, v, d]) => (
          <div key={l} className="card" style={{ padding: 20 }}>
            <span className="eyebrow" style={{ fontSize: 10.5 }}>{l}</span>
            <div className="row between" style={{ alignItems: "flex-end", marginTop: 10 }}><strong className="mono" style={{ fontSize: 28 }}>{v}</strong><span className="pill" style={{ background: "var(--verified-tint)", color: "var(--verified)", fontSize: 11, padding: "3px 9px" }}>{d}</span></div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }} className="dash-grid">
        <div className="card" style={{ padding: 24 }}>
          <div className="row between" style={{ marginBottom: 22 }}><strong style={{ fontSize: 16 }}>Revenue by month</strong><div className="row" style={{ gap: 14, fontSize: 12 }}><span className="row gap-1"><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--pine)" }} /> Subscription</span><span className="row gap-1"><span style={{ width: 10, height: 10, borderRadius: 3, background: "var(--signal-deep)" }} /> Pay-per-lead</span></div></div>
          <Bars data={[{l:"Jan",v:280},{l:"Feb",v:320},{l:"Mar",v:360},{l:"Apr",v:410},{l:"May",v:450,hot:true},{l:"Jun",v:486,hot:true}]} h={190} />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <strong style={{ fontSize: 16, display: "block", marginBottom: 18 }}>Revenue mix</strong>
          <div className="stack" style={{ gap: 16 }}>
            {([["Subscriptions", 38, "var(--pine)"], ["Pay-per-lead", 62, "var(--signal-deep)"]] as [string, number, string][]).map(([l, v, c]) => (
              <div key={l} className="stack" style={{ gap: 7 }}>
                <div className="row between" style={{ fontSize: 13.5 }}><span>{l}</span><strong className="mono">{v}%</strong></div>
                <div style={{ height: 10, borderRadius: 999, background: "var(--paper-2)" }}><div style={{ height: "100%", width: `${v}%`, background: c, borderRadius: 999 }} /></div>
              </div>
            ))}
            <div className="row between" style={{ marginTop: 8, paddingTop: 16, borderTop: "1px solid var(--line)" }}><span style={{ fontSize: 14, color: "var(--text-2)" }}>Total MTD</span><strong className="mono" style={{ fontSize: 22, color: "var(--pine)" }}>$486K</strong></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
