"use client";

import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";
import { ScoreRing, Spark, Bars, CaseTag } from "@/components/ui";
import { LEADS } from "@/lib/data";
import { useRouter } from "next/navigation";

const STATS = [
  { label: "New leads today", value: "8", delta: "+3 vs yest.", spark: [3, 5, 4, 6, 5, 7, 8], color: "var(--pine)" },
  { label: "Response rate", value: "94%", delta: "+2pts", spark: [88, 90, 89, 92, 91, 93, 94], color: "var(--verified)" },
  { label: "Median response", value: "3m 40s", delta: "-50s", spark: [6, 5, 5, 4, 4, 4, 3.6], color: "var(--amber)" },
  { label: "Lead value (mo)", value: "$284K", delta: "+18%", spark: [180, 200, 210, 240, 250, 270, 284], color: "var(--signal-deep)" },
];

const WEEK_DATA = [
  { l: "Mon", v: 6 },
  { l: "Tue", v: 9 },
  { l: "Wed", v: 5 },
  { l: "Thu", v: 11, hot: true },
  { l: "Fri", v: 8 },
  { l: "Sat", v: 3 },
  { l: "Sun", v: 2 },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <AppLayout>
      {/* greeting + live alert */}
      <div className="row between" style={{ marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 className="display" style={{ fontSize: 30 }}>Good morning, Sarah.</h2>
          <p style={{ color: "var(--text-2)", fontSize: 15, marginTop: 4 }}>You have <strong style={{ color: "var(--coral)" }}>2 new matched leads</strong> waiting — your fastest competitors respond in minutes.</p>
        </div>
      </div>

      {/* stat cards */}
      <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }}>
        {STATS.map(s => (
          <div key={s.label} className="card" style={{ padding: 20 }}>
            <div className="row between" style={{ marginBottom: 14 }}>
              <span className="eyebrow" style={{ fontSize: 10.5 }}>{s.label}</span>
              <span className="pill" style={{ background: "var(--verified-tint)", color: "var(--verified)", fontSize: 11, padding: "3px 8px" }}>{s.delta}</span>
            </div>
            <div className="row between" style={{ alignItems: "flex-end" }}>
              <strong className="mono" style={{ fontSize: 28, color: "var(--ink)", letterSpacing: "-0.02em" }}>{s.value}</strong>
              <Spark data={s.spark} color={s.color} w={86} h={34} />
            </div>
          </div>
        ))}
      </div>

      {/* bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }} className="dash-grid">
        {/* live lead feed */}
        <div className="card" style={{ padding: 22 }}>
          <div className="row between" style={{ marginBottom: 16 }}>
            <div className="row" style={{ gap: 9 }}><span className="pulse-dot coral" /><strong style={{ fontSize: 16 }}>Live lead feed</strong></div>
            <button onClick={() => router.push("/attorney/leads")} style={{ fontSize: 13.5, color: "var(--pine)", fontWeight: 600 }} className="row gap-1">View all <Icon name="arrowR" size={15} /></button>
          </div>
          <div className="stack" style={{ gap: 11 }}>
            {LEADS.slice(0, 4).map(l => (
              <button key={l.id} onClick={() => router.push("/attorney/leads/detail")} className="row between" style={{
                padding: 14, borderRadius: 14, border: "1px solid var(--line)",
                background: l.status === "new" ? "var(--signal-tint)" : "var(--paper)",
                textAlign: "left", transition: "transform .15s", width: "100%",
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateX(3px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                <div className="row" style={{ gap: 13 }}>
                  <ScoreRing value={l.quality} size={42} stroke={4} />
                  <div className="stack" style={{ gap: 4 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <strong style={{ fontSize: 14.5 }}>{l.name}</strong>
                      {l.status === "new" && <span className="pill" style={{ background: "var(--coral)", color: "#fff", fontSize: 9.5, padding: "2px 7px" }}>NEW</span>}
                    </div>
                    <div className="row" style={{ gap: 8, fontSize: 12.5, color: "var(--text-3)" }}>
                      <CaseTag type={l.type} sm />
                      <span>· {l.city}</span>
                    </div>
                  </div>
                </div>
                <div className="stack" style={{ alignItems: "flex-end", gap: 3 }}>
                  <strong className="mono" style={{ fontSize: 14, color: "var(--pine)" }}>{l.value}</strong>
                  <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{l.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* right column */}
        <div className="stack" style={{ gap: 18 }}>
          <div className="card" style={{ padding: 22 }}>
            <strong style={{ fontSize: 16, display: "block", marginBottom: 18 }}>Leads this week</strong>
            <Bars data={WEEK_DATA} />
          </div>
          <div className="card" style={{ padding: 22 }}>
            <strong style={{ fontSize: 16, display: "block", marginBottom: 16 }}>By practice area</strong>
            <div className="stack" style={{ gap: 13 }}>
              {([["Personal Injury", 62, "var(--coral)"], ["Employment", 28, "var(--verified)"], ["Family", 10, "#9B5DE5"]] as [string, number, string][]).map(([l, v, c]) => (
                <div key={l} className="stack" style={{ gap: 6 }}>
                  <div className="row between" style={{ fontSize: 13 }}><span>{l}</span><strong className="mono">{v}%</strong></div>
                  <div style={{ height: 7, borderRadius: 999, background: "var(--paper-2)" }}><div style={{ height: "100%", width: `${v}%`, background: c, borderRadius: 999, transition: "width .6s var(--ease)" }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
