"use client";

import AppLayout from "@/components/attorney-layout";
import { Spark, Bars } from "@/components/ui";

const STATS = [
  { label: "Total leads", value: "47", delta: "+12 this month", spark: [18, 22, 28, 32, 38, 42, 44, 47], color: "var(--signal)" },
  { label: "Acceptance rate", value: "76%", delta: "+4pp", spark: [60, 64, 66, 70, 72, 73, 74, 76], color: "var(--verified)" },
  { label: "Avg. response", value: "3m 12s", delta: "-22s", spark: [5.5, 5, 4.7, 4.2, 4, 3.6, 3.4, 3.2], color: "var(--amber)" },
  { label: "Revenue", value: "$14.2K", delta: "+$3.1K", spark: [6, 7.2, 8.5, 9.4, 10.2, 11.1, 12.8, 14.2], color: "var(--gold)" },
];

const WEEKLY_DATA = [
  { l: "W1", v: 12 },
  { l: "W2", v: 18 },
  { l: "W3", v: 14, hot: true },
  { l: "W4", v: 22 },
  { l: "W5", v: 19 },
  { l: "W6", v: 25, hot: true },
  { l: "W7", v: 20 },
  { l: "W8", v: 28, hot: true },
];

const SOURCE_DATA = [
  { l: "Google Ads", v: 42, hot: true },
  { l: "Organic", v: 28 },
  { l: "Referral", v: 18 },
  { l: "Direct", v: 12 },
];

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>Analytics</h1>

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
            <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
              {s.value}
            </div>
            <span style={{ fontSize: 12.5, color: "var(--verified)", fontWeight: 600 }}>{s.delta}</span>
          </div>
        ))}
      </div>

      {/* charts grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* leads & acceptances */}
        <div className="card" style={{ padding: "24px 26px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>
            Leads & acceptances
          </h3>
          <Bars data={WEEKLY_DATA} h={160} color="var(--signal-tint)" />
        </div>

        {/* lead source ROI */}
        <div className="card" style={{ padding: "24px 26px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 20 }}>
            Lead source ROI
          </h3>
          <Bars data={SOURCE_DATA} h={160} color="var(--pine-tint)" />
        </div>
      </div>
    </AppLayout>
  );
}
