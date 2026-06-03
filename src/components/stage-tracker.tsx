"use client";

import { Fragment } from "react";
import { Icon } from "@/components/icons";

export default function StageTracker({ stage = 3, compact }: { stage?: number; compact?: boolean }) {
  const stages = ["Submitted", "Verified", "Matched", "In contact", "Retained"];
  const cur = stage >= 7 ? 4 : stage >= 5 ? 3 : stage >= 3 ? 2 : stage >= 1 ? 1 : 0;
  return (
    <div className="row" style={{ width: "100%" }}>
      {stages.map((s, i) => (
        <Fragment key={s}>
          <div className="stack" style={{ alignItems: "center", gap: 7, flex: "none" }}>
            <div style={{ width: compact ? 26 : 32, height: compact ? 26 : 32, borderRadius: "50%", display: "grid", placeItems: "center", background: i < cur ? "var(--verified)" : i === cur ? "var(--signal)" : "var(--paper-2)", color: "#fff", flex: "none" }}>
              {i < cur ? <Icon name="check" size={15} stroke={3} color="#fff" /> : i === cur ? <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff" }} /> : <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-3)" }} />}
            </div>
            <span style={{ fontSize: 11.5, fontWeight: i === cur ? 700 : 500, color: i === cur ? "var(--signal)" : i < cur ? "var(--verified)" : "var(--text-3)", whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < stages.length - 1 && <div style={{ flex: 1, height: 2.5, background: i < cur ? "var(--verified)" : "var(--line-2)", margin: compact ? "0 6px 22px" : "0 10px 24px", borderRadius: 2 }} />}
        </Fragment>
      ))}
    </div>
  );
}
