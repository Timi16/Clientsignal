"use client";

import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { Avatar, Verified, CaseTag } from "@/components/ui";
import { ATTORNEYS, RATING } from "@/lib/data";

export default function AdminFirms() {
  return (
    <AdminLayout title="Firms & attorneys" action={<button className="btn btn-pine btn-sm"><Icon name="plus" size={15} /> Invite firm</button>}>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: "13px 22px", borderBottom: "1px solid var(--line)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ flex: 3 }}>Attorney / firm</span><span style={{ flex: 1.5 }}>Practice</span><span style={{ width: 90, textAlign: "center" }}>Rating</span><span style={{ width: 70, textAlign: "center" }}>Leads</span><span style={{ width: 80, textAlign: "center" }}>Resp.</span><span style={{ width: 90, textAlign: "right" }}>Status</span>
        </div>
        {ATTORNEYS.map((a, i) => (
          <div key={i} className="row" style={{ padding: "16px 22px", borderBottom: i < ATTORNEYS.length - 1 ? "1px solid var(--line)" : "none" }}>
            <div className="row" style={{ flex: 3, gap: 13 }}><Avatar name={a.name} size={42} /><div className="stack" style={{ gap: 3 }}><div className="row" style={{ gap: 6 }}><strong style={{ fontSize: 14.5 }}>{a.name}</strong>{a.status === "approved" && <Verified size={14} />}</div><span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{a.firm}</span></div></div>
            <div style={{ flex: 1.5 }}><div className="row" style={{ gap: 4, flexWrap: "wrap" }}>{a.specialties.map(s => <CaseTag key={s} type={s} sm />)}</div></div>
            <div style={{ width: 90, textAlign: "center" }}><span className="pill" style={{ background: RATING[a.rating][2], color: RATING[a.rating][1], fontSize: 11, padding: "4px 11px" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: RATING[a.rating][1] }} /> {RATING[a.rating][0]}</span></div>
            <div style={{ width: 70, textAlign: "center" }}><strong className="mono">{a.leads}</strong></div>
            <div style={{ width: 80, textAlign: "center" }}><span className="mono" style={{ color: "var(--text-2)" }}>{a.responseTime}</span></div>
            <div style={{ width: 90, textAlign: "right" }}><span className="pill" style={{ background: a.status === "approved" ? "var(--verified-tint)" : "var(--amber-tint)", color: a.status === "approved" ? "var(--verified)" : "var(--amber)", fontSize: 11, padding: "4px 10px" }}>{a.status}</span></div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
