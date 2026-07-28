"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { Avatar, CaseTag } from "@/components/ui";
import * as adminApi from "@/lib/api/admin";
import type { Lead } from "@/lib/api/leads";

const ST: Record<string, [string, string, string]> = {
  routed: ["Routed", "var(--blue-tint)", "var(--signal)"],
  responded: ["Responded", "var(--verified-tint)", "var(--verified)"],
  qa: ["In QA", "var(--amber-tint)", "var(--amber)"],
  unrouted: ["Unrouted", "var(--coral-tint)", "var(--coral)"],
};

export default function AdminInquiries() {
  const [f, setF] = useState("all");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminApi.adminListLeads({ limit: 50 }).then(res => {
      if (!cancelled) {
        setLeads(res.leads);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const rows = leads.map((l) => ({ ...l, routed: l.matchedAttorneyId || "—", state: l.status || "unrouted" }));
  const filters: [string, string][] = [["all", "All"], ["unrouted", "Unrouted"], ["qa", "In QA"], ["routed", "Routed"], ["responded", "Responded"]];
  const list = f === "all" ? rows : rows.filter(r => r.state === f);

  return (
    <AdminLayout title="Client inquiries" action={<button className="btn btn-ghost btn-sm"><Icon name="download" size={15} /> Export</button>}>
      <div className="row between" style={{ marginBottom: 20, flexWrap: "wrap", gap: 14 }}>
        <div className="row" style={{ gap: 7, background: "var(--card)", padding: 5, borderRadius: 999, border: "1px solid var(--line)" }}>
          {filters.map(([k, l]) => <button key={k} onClick={() => setF(k)} className="btn btn-sm" style={{ background: f === k ? "var(--pine)" : "transparent", color: f === k ? "#fff" : "var(--text-2)", boxShadow: "none" }}>{l}</button>)}
        </div>
        <span style={{ fontSize: 13.5, color: "var(--text-3)" }}>{list.length} inquiries</span>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="row" style={{ padding: "13px 22px", borderBottom: "1px solid var(--line)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ flex: 2.4 }}>Client</span><span style={{ flex: 1.4 }}>Type</span><span style={{ width: 64, textAlign: "center" }}>Score</span><span style={{ flex: 1.6 }}>Routed to</span><span style={{ width: 100, textAlign: "right" }}>Status</span>
        </div>
        {loading ? (
          <div style={{ padding: "40px 22px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>Loading inquiries...</div>
        ) : list.length === 0 ? (
          <div style={{ padding: "40px 22px", textAlign: "center", color: "var(--text-3)", fontSize: 14 }}>No inquiries found.</div>
        ) : list.map((l, i) => {
          const st = ST[l.state] || ST.unrouted;
          return (
            <div key={l.id} className="row" style={{ padding: "15px 22px", borderBottom: i < list.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div className="row" style={{ flex: 2.4, gap: 12 }}><Avatar name={l.name} size={40} /><div className="stack" style={{ gap: 2 }}><strong style={{ fontSize: 14.5 }}>{l.name}</strong><span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{l.id} · {l.city} · {l.createdAt}</span></div></div>
              <div style={{ flex: 1.4 }}><CaseTag type={l.practiceArea} sm /></div>
              <div style={{ width: 64, textAlign: "center" }}><span className="mono" style={{ fontWeight: 700, color: l.qualityScore >= 80 ? "var(--verified)" : "var(--amber)" }}>{l.qualityScore}</span></div>
              <div style={{ flex: 1.6, fontSize: 13.5, color: l.routed === "—" ? "var(--text-3)" : "var(--text-1)" }}>{l.routed !== "—" ? <span className="row" style={{ gap: 7 }}><Avatar name={l.routed} size={24} /> {l.routed}</span> : "—"}</div>
              <div style={{ width: 100, textAlign: "right" }}><span className="pill" style={{ fontSize: 11, padding: "4px 11px", background: st[1], color: st[2] }}>{st[0]}</span></div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
