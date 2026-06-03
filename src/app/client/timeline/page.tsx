"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientLayout, { useActiveCase, buildTimeline } from "@/components/client-layout";
import { Icon } from "@/components/icons";
import { CaseTag } from "@/components/ui";
import { CASE_STATUS, CASE_TYPES, CLIENT_ATTYS, CLIENT_CASES } from "@/lib/data";

export default function ClientTimeline() {
  const router = useRouter();
  const { activeCase, setActiveId } = useActiveCase();
  const [sel, setSel] = useState(activeCase.id);
  const c = CLIENT_CASES.find(x => x.id === sel) || CLIENT_CASES[0];
  const atty = c.atty ? CLIENT_ATTYS[c.atty] : null;
  const steps = buildTimeline(c.stage, atty ? atty.name : null);
  const doneN = steps.filter(s => s.done).length;

  return (
    <ClientLayout title="Case Timeline">
      <div style={{ maxWidth: 900 }}>
        {/* case selector */}
        <span className="eyebrow" style={{ display: "block", marginBottom: 12 }}>Select a case</span>
        <div className="row" style={{ gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
          {CLIENT_CASES.map(x => {
            const st = CASE_STATUS[x.status];
            const on = x.id === sel;
            return (
              <button key={x.id} onClick={() => { setSel(x.id); setActiveId(x.id); }} className="card" style={{ padding: "12px 16px", textAlign: "left", border: "1.5px solid " + (on ? "var(--signal)" : "var(--line)"), background: on ? "var(--blue-tint)" : "var(--card)", display: "flex", alignItems: "center", gap: 11 }}>
                <span style={{ width: 32, height: 32, borderRadius: 9, background: CASE_TYPES[x.type]?.tint, display: "grid", placeItems: "center", flex: "none" }}><span style={{ width: 11, height: 11, borderRadius: "50%", background: CASE_TYPES[x.type]?.color }} /></span>
                <div className="stack" style={{ gap: 2 }}>
                  <strong style={{ fontSize: 13.5, whiteSpace: "nowrap" }}>{CASE_TYPES[x.type]?.label}</strong>
                  <span className="row" style={{ gap: 5, fontSize: 11, color: st.color }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} /> {st.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* selected case timeline */}
        <div className="card" style={{ padding: 28 }}>
          <div className="row between" style={{ marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
            <div className="row" style={{ gap: 11 }}><CaseTag type={c.type} /><span className="mono" style={{ fontSize: 12.5, color: "var(--text-3)" }}>{c.id}</span></div>
            <span className="pill" style={{ background: "var(--blue-tint)", color: "var(--signal)", fontSize: 12 }}>{doneN} of {steps.length} complete</span>
          </div>
          <div className="stack">
            {steps.map((e, i) => (
              <div key={i} className="row" style={{ gap: 16, alignItems: "flex-start" }}>
                <div className="stack" style={{ alignItems: "center", flex: "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", flex: "none", background: e.done ? "var(--verified)" : e.current ? "var(--signal)" : "var(--paper-2)", color: e.done || e.current ? "#fff" : "var(--text-3)", boxShadow: e.current ? "0 0 0 5px var(--blue-tint)" : "none" }}>
                    {e.done ? <Icon name="check" size={19} stroke={3} color="#fff" /> : <Icon name={e.icon} size={18} />}
                  </div>
                  {i < steps.length - 1 && <div style={{ width: 2.5, flex: 1, minHeight: 38, background: e.done ? "var(--verified)" : "var(--line-2)", margin: "4px 0" }} />}
                </div>
                <div className="stack" style={{ gap: 3, paddingBottom: 26, flex: 1 }}>
                  <div className="row between" style={{ flexWrap: "wrap", gap: 6 }}>
                    <strong style={{ fontSize: 15.5, color: e.current ? "var(--signal)" : e.done ? "var(--ink)" : "var(--text-3)" }}>{e.t}</strong>
                    <span className="mono" style={{ fontSize: 12, color: e.current ? "var(--signal)" : "var(--text-3)" }}>{e.d}</span>
                  </div>
                  <span style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.5 }}>{e.note}</span>
                  {e.current && atty && <button className="btn btn-signal btn-sm" style={{ alignSelf: "flex-start", marginTop: 8 }} onClick={() => router.push("/client/messages")}>Reply to {atty.name.split(" ")[0]} <Icon name="arrowR" size={15} /></button>}
                  {e.current && !atty && <span className="row gap-1" style={{ fontSize: 13, color: "var(--amber)", fontWeight: 600, marginTop: 6 }}><span className="pulse-dot" style={{ background: "var(--amber)" }} /> Matching in progress…</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
