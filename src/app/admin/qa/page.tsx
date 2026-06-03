"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { ScoreRing, CaseTag } from "@/components/ui";
import { LEADS } from "@/lib/data";

export default function AdminQA() {
  const [decided, setDecided] = useState<Record<string, string>>({});
  const qa = LEADS.slice(0, 4).map((l, i) => ({ ...l, flag: ["Possible duplicate", "Low completeness", "Out of jurisdiction", "Clean"][i], flagColor: i === 3 ? "var(--verified)" : "var(--amber)" }));

  return (
    <AdminLayout title="Lead quality review" action={<span style={{ fontSize: 13.5, color: "var(--text-3)" }}>3 flagged · 1 clean</span>}>
      <div className="stack" style={{ gap: 14 }}>
        {qa.map(l => (
          <div key={l.id} className="card" style={{ padding: 20 }}>
            <div className="row between" style={{ marginBottom: 14 }}>
              <div className="row" style={{ gap: 13 }}>
                <ScoreRing value={l.quality} size={48} stroke={5} />
                <div className="stack" style={{ gap: 4 }}><div className="row" style={{ gap: 9 }}><strong style={{ fontSize: 15 }}>{l.name}</strong><CaseTag type={l.type} sm /></div><span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{l.id} · {l.city} · via {l.channel}</span></div>
              </div>
              <span className="pill" style={{ background: l.flag === "Clean" ? "var(--verified-tint)" : "var(--amber-tint)", color: l.flagColor, fontSize: 12 }}><Icon name={l.flag === "Clean" ? "check" : "flag"} size={13} /> {l.flag}</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 16, paddingLeft: 61 }}>{l.summary}</p>
            {decided[l.id] ? (
              <div style={{ paddingLeft: 61 }}><span className="pill" style={{ background: decided[l.id] === "approve" ? "var(--verified-tint)" : "var(--coral-tint)", color: decided[l.id] === "approve" ? "var(--verified)" : "var(--coral)" }}>{decided[l.id] === "approve" ? "✓ Approved for routing" : "Refunded & removed"}</span></div>
            ) : (
              <div className="row" style={{ gap: 10, paddingLeft: 61 }}>
                <button className="btn btn-pine btn-sm" onClick={() => setDecided(d => ({ ...d, [l.id]: "approve" }))}><Icon name="check" size={15} /> Approve for routing</button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => setDecided(d => ({ ...d, [l.id]: "refund" }))}><Icon name="refresh" size={15} /> Refund &amp; remove</button>
                <button className="btn btn-ghost btn-sm">Request more info</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
