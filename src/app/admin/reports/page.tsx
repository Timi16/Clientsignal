"use client";

import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { Bars } from "@/components/ui";

export default function AdminReports() {
  return (
    <AdminLayout title="Reports" action={<button className="btn btn-ghost btn-sm"><Icon name="download" size={15} /> Export CSV</button>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }} className="stat-grid">
        {([["Leads processed", "8,412", "this month"], ["Avg quality score", "78", "all leads"], ["Acceptance rate", "91%", "platform-wide"], ["Avg time to route", "42s", "−18% MoM"]] as [string, string, string][]).map(([l, v, s]) => (
          <div key={l} className="card" style={{ padding: 22 }}><span className="eyebrow" style={{ fontSize: 10.5 }}>{l}</span><strong className="mono" style={{ fontSize: 30, display: "block", margin: "8px 0 2px" }}>{v}</strong><span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{s}</span></div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 }} className="dash-grid">
        <div className="card" style={{ padding: 24 }}>
          <div className="row between" style={{ marginBottom: 22 }}><strong style={{ fontSize: 16 }}>Lead volume by month</strong><span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>Last 6 months</span></div>
          <Bars data={[{l:"Jan",v:5200},{l:"Feb",v:5900},{l:"Mar",v:6600},{l:"Apr",v:7300},{l:"May",v:7900,hot:true},{l:"Jun",v:8412,hot:true}]} h={190} />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <strong style={{ fontSize: 16, display: "block", marginBottom: 18 }}>Top practice areas</strong>
          <div className="stack" style={{ gap: 14 }}>
            {([["Personal Injury", 34, "#DC2626"], ["Family Law", 22, "#7C3AED"], ["Immigration", 18, "#2563EB"], ["Criminal", 14, "#0B1F3A"], ["Employment", 12, "#16A34A"]] as [string, number, string][]).map(([l, v, c]) => (
              <div key={l} className="stack" style={{ gap: 6 }}>
                <div className="row between" style={{ fontSize: 13 }}><span>{l}</span><strong className="mono">{v}%</strong></div>
                <div style={{ height: 8, borderRadius: 999, background: "var(--paper-2)" }}><div style={{ height: "100%", width: `${v * 2.6}%`, maxWidth: "100%", background: c, borderRadius: 999 }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <strong style={{ fontSize: 16, display: "block", marginBottom: 18 }}>Conversion funnel</strong>
        <div className="row" style={{ gap: 0, alignItems: "stretch" }}>
          {([["Inquiries", "8,412", 100], ["Scored & valid", "7,640", 91], ["Routed", "7,210", 86], ["Accepted", "6,560", 78], ["Responded", "6,180", 73]] as [string, string, number][]).map(([l, v, w], i) => (
            <div key={l} className="stack" style={{ flex: 1, alignItems: "center", gap: 10 }}>
              <div style={{ width: "100%", padding: "0 4px" }}><div style={{ height: 90, display: "flex", alignItems: "flex-end" }}><div style={{ width: "100%", height: `${w}%`, background: `linear-gradient(180deg, var(--signal), var(--pine))`, opacity: 1 - i * 0.13, borderRadius: "8px 8px 0 0" }} /></div></div>
              <div className="stack" style={{ alignItems: "center", gap: 1 }}><strong className="mono" style={{ fontSize: 15 }}>{v}</strong><span style={{ fontSize: 11.5, color: "var(--text-3)" }}>{l}</span></div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
