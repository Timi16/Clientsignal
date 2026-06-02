"use client";

import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";
import { ScoreRing, Spark, Bars, Avatar, CaseTag } from "@/components/ui";
import { LEADS } from "@/lib/data";
import { useRouter } from "next/navigation";

const STATS = [
  { label: "New leads", value: "8", delta: "+3 vs last week", spark: [3, 5, 4, 6, 5, 7, 6, 8], color: "var(--signal)" },
  { label: "Response rate", value: "94%", delta: "+2pp", spark: [80, 85, 88, 90, 87, 92, 91, 94], color: "var(--verified)" },
  { label: "Median response", value: "3m 40s", delta: "-18s", spark: [5, 4.8, 4.5, 4.2, 4, 3.9, 3.8, 3.67], color: "var(--amber)" },
  { label: "Lead value", value: "$284K", delta: "+$32K", spark: [180, 200, 210, 235, 250, 260, 270, 284], color: "var(--gold)" },
];

const WEEK_DATA = [
  { l: "Mon", v: 4 },
  { l: "Tue", v: 6 },
  { l: "Wed", v: 3 },
  { l: "Thu", v: 7, hot: true },
  { l: "Fri", v: 5 },
  { l: "Sat", v: 2 },
  { l: "Sun", v: 1 },
];

const AREA_DATA = [
  { l: "PI", v: 38, hot: true },
  { l: "Fam", v: 22 },
  { l: "Crim", v: 18 },
  { l: "Imm", v: 14 },
  { l: "Emp", v: 8 },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <AppLayout>
      {/* greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
          Good morning, Sarah.
        </h1>
        <p className="row" style={{ gap: 8, color: "var(--text-2)", fontSize: 15 }}>
          <span className="pulse-dot" style={{ width: 8, height: 8 }} />
          You have <strong style={{ color: "var(--signal)" }}>2 new leads</strong> waiting for a response.
        </p>
      </div>

      {/* stat cards */}
      <div
        className="stat-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}
      >
        {STATS.map((s) => (
          <div key={s.label} className="card" style={{ padding: "22px 24px" }}>
            <div className="row between" style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{s.label}</span>
              <Spark data={s.spark} w={80} h={28} color={s.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }} className="mono">
              {s.value}
            </div>
            <span style={{ fontSize: 12.5, color: "var(--verified)", fontWeight: 600 }}>{s.delta}</span>
          </div>
        ))}
      </div>

      {/* bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
        {/* live lead feed */}
        <div className="card" style={{ padding: "24px 26px" }}>
          <div className="row between" style={{ marginBottom: 20 }}>
            <h2 className="row" style={{ gap: 10, fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>
              <span className="pulse-dot" />
              Live lead feed
            </h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => router.push("/attorney/leads")}
            >
              View all
            </button>
          </div>
          <div className="stack" style={{ gap: 0 }}>
            {LEADS.slice(0, 4).map((l, i) => (
              <div
                key={l.id}
                className="row"
                style={{
                  gap: 16,
                  padding: "16px 0",
                  borderTop: i > 0 ? "1px solid var(--line)" : "none",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/attorney/leads/detail")}
              >
                <ScoreRing value={l.quality} size={48} stroke={5} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 650, fontSize: 14.5, color: "var(--ink)" }}>{l.name}</span>
                    <CaseTag type={l.type} sm />
                  </div>
                  <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                    {l.city} &middot; {l.time}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                    {l.value}
                  </div>
                  <span
                    className="pill"
                    style={{
                      fontSize: 11,
                      padding: "3px 9px",
                      background:
                        l.status === "new"
                          ? "var(--signal-tint)"
                          : l.status === "viewed"
                          ? "var(--amber-tint)"
                          : "var(--verified-tint)",
                      color:
                        l.status === "new"
                          ? "var(--signal)"
                          : l.status === "viewed"
                          ? "var(--amber)"
                          : "var(--verified)",
                    }}
                  >
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right column */}
        <div className="stack" style={{ gap: 20 }}>
          {/* weekly chart */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>
              Leads this week
            </h3>
            <Bars data={WEEK_DATA} h={120} color="var(--signal-tint)" />
          </div>

          {/* by practice area */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>
              By practice area
            </h3>
            <Bars data={AREA_DATA} h={110} color="var(--pine-tint)" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
