"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/attorney-layout";
import { useAuth } from "@/lib/auth-context";
import { get } from "@/lib/api/client";
import * as leadsApi from "@/lib/api/leads";
import type { Lead } from "@/lib/api/leads";

interface Analytics {
  totalLeads: number;
  acceptanceRate: number;
  avgResponseTime: string;
  revenueCents: number;
}

const AREA_LABELS: Record<string, string> = {
  injury: "Personal Injury", family: "Family Law", criminal: "Criminal Defense",
  immigration: "Immigration", employment: "Employment Law",
};

const AREA_COLORS: Record<string, string> = {
  injury: "var(--coral)", family: "#9B5DE5", criminal: "var(--amber)",
  immigration: "var(--signal)", employment: "var(--verified)",
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      get<Analytics>("/attorneys/analytics").catch(() => null),
      leadsApi.listLeads({ limit: 200 }).catch(() => ({ leads: [], total: 0 })),
    ]).then(([analyticsRes, leadsRes]) => {
      if (cancelled) return;
      setAnalytics(analyticsRes);
      setLeads(leadsRes.leads || []);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const totalLeads = analytics?.totalLeads ?? leads.length;
  const acceptanceRate = analytics?.acceptanceRate ?? 0;
  const avgResponse = analytics?.avgResponseTime || "—";
  const revenue = analytics?.revenueCents ? `$${(analytics.revenueCents / 100).toLocaleString()}` : "—";

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  leads.forEach(l => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1; });

  // Practice area breakdown
  const areaCounts: Record<string, number> = {};
  leads.forEach(l => { areaCounts[l.practiceArea] = (areaCounts[l.practiceArea] || 0) + 1; });
  const totalForAreas = Object.values(areaCounts).reduce((a, b) => a + b, 0) || 1;
  const areaBreakdown = Object.entries(areaCounts)
    .map(([area, count]) => ({ area, count, pct: Math.round((count / totalForAreas) * 100) }))
    .sort((a, b) => b.count - a.count);

  // Average quality score
  const avgQuality = leads.length > 0
    ? Math.round(leads.reduce((sum, l) => sum + l.qualityScore, 0) / leads.length)
    : 0;

  return (
    <AppLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>
        {user?.name ? `${user.name}'s Analytics` : "Analytics"}
      </h1>

      {loading ? (
        <p style={{ color: "var(--text-3)", padding: 40, textAlign: "center" }}>Loading analytics...</p>
      ) : (
        <>
          {/* stat cards */}
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total leads", value: String(totalLeads) },
              { label: "Acceptance rate", value: acceptanceRate > 0 ? `${acceptanceRate}%` : "—" },
              { label: "Avg. response", value: avgResponse },
              { label: "Avg. quality score", value: avgQuality > 0 ? String(avgQuality) : "—" },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: "22px 24px" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 14 }}>{s.label}</span>
                <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* charts grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* practice area breakdown */}
            <div className="card" style={{ padding: "24px 26px" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>By practice area</h3>
              {areaBreakdown.length === 0 ? (
                <p style={{ color: "var(--text-3)", fontSize: 14, textAlign: "center", padding: 30 }}>No lead data yet.</p>
              ) : (
                <div className="stack" style={{ gap: 18 }}>
                  {areaBreakdown.map(({ area, count, pct }) => (
                    <div key={area} className="stack" style={{ gap: 6 }}>
                      <div className="row between" style={{ fontSize: 13 }}>
                        <span>{AREA_LABELS[area] || area}</span>
                        <strong className="mono">{count} ({pct}%)</strong>
                      </div>
                      <div style={{ height: 7, borderRadius: 999, background: "var(--paper-2)" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: AREA_COLORS[area] || "var(--pine)", borderRadius: 999, transition: "width .6s var(--ease)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* lead status breakdown */}
            <div className="card" style={{ padding: "24px 26px" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>Lead status</h3>
              {Object.keys(statusCounts).length === 0 ? (
                <p style={{ color: "var(--text-3)", fontSize: 14, textAlign: "center", padding: 30 }}>No lead data yet.</p>
              ) : (
                <div className="stack" style={{ gap: 14 }}>
                  {[
                    { key: "new", label: "New", color: "var(--signal)" },
                    { key: "viewed", label: "Viewed", color: "var(--amber)" },
                    { key: "claimed", label: "Claimed", color: "var(--verified)" },
                    { key: "responded", label: "Responded", color: "var(--pine)" },
                  ].map(({ key, label, color }) => {
                    const count = statusCounts[key] || 0;
                    const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                    return (
                      <div key={key} className="row between" style={{ padding: "12px 16px", borderRadius: 10, background: "var(--paper)" }}>
                        <div className="row" style={{ gap: 10 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                        </div>
                        <strong className="mono" style={{ fontSize: 14 }}>{count} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>({pct}%)</span></strong>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
