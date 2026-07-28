"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";
import { ScoreRing, CaseTag } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import * as leadsApi from "@/lib/api/leads";
import type { Lead } from "@/lib/api/leads";
import { get } from "@/lib/api/client";

interface Analytics {
  totalLeads: number;
  acceptanceRate: number;
  avgResponseTime: string;
  revenueCents: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      leadsApi.listLeads({ limit: 4 }).catch(() => ({ leads: [], total: 0 })),
      get<Analytics>("/attorneys/analytics").catch(() => null),
    ]).then(([leadsRes, analyticsRes]) => {
      if (cancelled) return;
      setLeads(leadsRes.leads || []);
      setAnalytics(analyticsRes);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const newLeadCount = (leads || []).filter(l => l.status === "new").length;
  const totalLeads = analytics?.totalLeads ?? leads.length;
  const responseTime = analytics?.avgResponseTime || "—";
  const acceptanceRate = analytics?.acceptanceRate ?? 0;

  // Build practice area breakdown from real leads
  const areaMap: Record<string, number> = {};
  (leads || []).forEach(l => {
    areaMap[l.practiceArea] = (areaMap[l.practiceArea] || 0) + 1;
  });
  const totalForAreas = Object.values(areaMap).reduce((a, b) => a + b, 0) || 1;
  const areaBreakdown = Object.entries(areaMap)
    .map(([area, count]) => ({ area, pct: Math.round((count / totalForAreas) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);

  const AREA_COLORS: Record<string, string> = {
    injury: "var(--coral)", family: "#9B5DE5", criminal: "var(--amber)",
    immigration: "var(--signal)", employment: "var(--verified)",
  };

  const AREA_LABELS: Record<string, string> = {
    injury: "Personal Injury", family: "Family Law", criminal: "Criminal Defense",
    immigration: "Immigration", employment: "Employment Law",
  };

  return (
    <AppLayout>
      {/* greeting */}
      <div className="row between" style={{ marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 className="display" style={{ fontSize: 30 }}>Good morning, {firstName}.</h2>
          <p style={{ color: "var(--text-2)", fontSize: 15, marginTop: 4 }}>
            {newLeadCount > 0
              ? <>You have <strong style={{ color: "var(--coral)" }}>{newLeadCount} new matched lead{newLeadCount !== 1 ? "s" : ""}</strong> waiting — your fastest competitors respond in minutes.</>
              : <>No new leads right now — check back soon or adjust your preferences.</>
            }
          </p>
        </div>
      </div>

      {/* stat cards */}
      <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 26 }}>
        {[
          { label: "Total leads", value: String(totalLeads), color: "var(--pine)" },
          { label: "New leads", value: String(newLeadCount), color: "var(--coral)" },
          { label: "Median response", value: responseTime, color: "var(--amber)" },
          { label: "Acceptance rate", value: acceptanceRate > 0 ? `${acceptanceRate}%` : "—", color: "var(--verified)" },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 24, minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="eyebrow" style={{ fontSize: 10.5 }}>{s.label}</span>
            <strong className="mono" style={{ fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>{s.value}</strong>
          </div>
        ))}
      </div>

      {/* bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22 }} className="dash-grid">
        {/* live lead feed */}
        <div className="card" style={{ padding: 26, minHeight: 474 }}>
          <div className="row between" style={{ marginBottom: 20 }}>
            <div className="row" style={{ gap: 9 }}><span className="pulse-dot coral" /><strong style={{ fontSize: 16 }}>Live lead feed</strong></div>
            <button onClick={() => router.push("/attorney/leads")} style={{ fontSize: 13.5, color: "var(--pine)", fontWeight: 600 }} className="row gap-1">View all <Icon name="arrowR" size={15} /></button>
          </div>
          <div className="stack" style={{ gap: 14 }}>
            {loading ? (
              <p style={{ padding: 20, color: "var(--text-3)", fontSize: 14, textAlign: "center" }}>Loading leads...</p>
            ) : (leads || []).length === 0 ? (
              <p style={{ padding: 20, color: "var(--text-3)", fontSize: 14, textAlign: "center" }}>No leads yet — they&apos;ll appear here when matched.</p>
            ) : (leads || []).map(l => (
              <button key={l.id} onClick={() => router.push("/attorney/leads")} className="row between" style={{
                padding: "18px 16px", minHeight: 76, borderRadius: 14, border: "1px solid var(--line)",
                background: l.status === "new" ? "var(--signal-tint)" : "var(--paper)",
                textAlign: "left", transition: "transform .15s", width: "100%",
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateX(3px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                <div className="row" style={{ gap: 13 }}>
                  <ScoreRing value={l.qualityScore} size={42} stroke={4} />
                  <div className="stack" style={{ gap: 4 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <strong style={{ fontSize: 14.5 }}>{l.name || "New Lead"}</strong>
                      {l.status === "new" && <span className="pill" style={{ background: "var(--coral)", color: "#fff", fontSize: 9.5, padding: "2px 7px" }}>NEW</span>}
                    </div>
                    <div className="row" style={{ gap: 8, fontSize: 12.5, color: "var(--text-3)" }}>
                      <CaseTag type={l.practiceArea} sm />
                      <span>· {l.city}{l.state ? `, ${l.state}` : ""}</span>
                    </div>
                  </div>
                </div>
                <div className="stack" style={{ alignItems: "flex-end", gap: 3 }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{new Date(l.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* right column */}
        <div className="stack" style={{ gap: 22 }}>
          {/* practice area breakdown */}
          <div className="card" style={{ padding: 26, minHeight: 244 }}>
            <strong style={{ fontSize: 16, display: "block", marginBottom: 18 }}>By practice area</strong>
            {areaBreakdown.length === 0 ? (
              <p style={{ padding: 20, color: "var(--text-3)", fontSize: 14, textAlign: "center" }}>No lead data yet.</p>
            ) : (
              <div className="stack" style={{ gap: 17 }}>
                {areaBreakdown.map(({ area, pct }) => (
                  <div key={area} className="stack" style={{ gap: 6 }}>
                    <div className="row between" style={{ fontSize: 13 }}><span>{AREA_LABELS[area] || area}</span><strong className="mono">{pct}%</strong></div>
                    <div style={{ height: 7, borderRadius: 999, background: "var(--paper-2)" }}><div style={{ height: "100%", width: `${pct}%`, background: AREA_COLORS[area] || "var(--pine)", borderRadius: 999, transition: "width .6s var(--ease)" }} /></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* quick actions */}
          <div className="card" style={{ padding: 26, minHeight: 200 }}>
            <strong style={{ fontSize: 16, display: "block", marginBottom: 18 }}>Quick actions</strong>
            <div className="stack" style={{ gap: 10 }}>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => router.push("/attorney/leads")}><Icon name="inbox" size={17} /> View all leads</button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => router.push("/attorney/messages")}><Icon name="message" size={17} /> Messages</button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => router.push("/attorney/settings")}><Icon name="settings" size={17} /> Settings</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
