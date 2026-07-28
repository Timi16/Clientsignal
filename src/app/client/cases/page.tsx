"use client";

import { useRouter } from "next/navigation";
import ClientLayout, { useActiveCase, formatOpened } from "@/components/client-layout";
import { Icon } from "@/components/icons";
import { CASE_STATUS, CASE_TYPES } from "@/lib/data";

export default function ClientCases() {
  const router = useRouter();
  const { cases, setActiveId, loading } = useActiveCase();

  const open = (id: string) => { setActiveId(id); router.push("/client/dashboard"); };

  return (
    <ClientLayout title="Cases" action={<button className="btn btn-signal btn-sm" onClick={() => router.push("/client/new-case")}><Icon name="plus" size={15} /> New case</button>}>
      {/* create banner */}
      <button onClick={() => router.push("/client/new-case")} className="card" style={{ width: "100%", padding: 24, marginBottom: 22, textAlign: "left", display: "flex", alignItems: "center", gap: 18, border: "1.5px dashed var(--line-2)", background: "var(--blue-tint)" }}>
        <div style={{ width: 52, height: 52, borderRadius: 13, background: "var(--signal)", display: "grid", placeItems: "center", flex: "none" }}><Icon name="plus" size={24} color="#fff" /></div>
        <div className="stack" style={{ gap: 3, flex: 1 }}><strong style={{ fontSize: 17 }}>Start a new case</strong><span style={{ fontSize: 14, color: "var(--text-2)" }}>Describe your situation and get matched with a verified attorney.</span></div>
        <Icon name="arrowR" size={20} color="var(--signal)" />
      </button>

      {/* summary chips */}
      <div className="row" style={{ gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        {([["active", "In progress"], ["matched", "Matched"], ["pending", "Finding attorney"], ["closed", "Closed"]] as [string, string][]).map(([k, l]) => {
          const n = cases.filter(c => c.status === k).length;
          const st = CASE_STATUS[k];
          return <span key={k} className="pill" style={{ background: st.tint, color: st.color, fontSize: 12.5 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: st.dot }} /> {n} {l}</span>;
        })}
      </div>

      {cases.length === 0 ? (
        <div style={{ display: "grid", placeItems: "center", padding: 60 }}>
          <p style={{ fontSize: 15, color: "var(--text-3)" }}>Nothing here yet.</p>
        </div>
      ) : (
        <>
          <span className="eyebrow" style={{ display: "block", marginBottom: 14 }}>Your cases ({cases.length})</span>
          <div className="stack" style={{ gap: 12 }}>
            {cases.map(c => {
              const st = CASE_STATUS[c.status] || CASE_STATUS.pending;
              const ct = CASE_TYPES[c.practiceArea] || { label: c.practiceArea, color: "var(--text-2)", tint: "var(--pine-tint)" };
              return (
                <button key={c.id} onClick={() => open(c.id)} className="card feat-card" style={{ padding: 20, textAlign: "left", width: "100%", opacity: c.status === "closed" ? 0.72 : 1 }}>
                  <div className="row between" style={{ gap: 16, flexWrap: "wrap" }}>
                    <div className="row" style={{ gap: 15, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, background: ct.tint, display: "grid", placeItems: "center", flex: "none" }}><span style={{ width: 15, height: 15, borderRadius: "50%", background: ct.color }} /></div>
                      <div className="stack" style={{ gap: 4, minWidth: 0 }}>
                        <div className="row" style={{ gap: 9 }}><strong style={{ fontSize: 15.5, whiteSpace: "nowrap" }}>{ct.label}</strong><span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{c.id}</span>{c.unreadCount > 0 && <span className="pill" style={{ background: "var(--coral)", color: "#fff", fontSize: 10, padding: "2px 7px" }}>{c.unreadCount} new</span>}</div>
                        <span style={{ fontSize: 13, color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.matter} · {c.city} · opened {formatOpened(c.openedAt)}</span>
                      </div>
                    </div>
                    <span className="pill" style={{ background: st.tint, color: st.color, fontSize: 11.5, flex: "none" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: st.dot }} /> {st.label}</span>
                  </div>
                  <div className="row between" style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)", gap: 12, flexWrap: "wrap" }}>
                    <div className="row" style={{ gap: 9 }}>
                      {c.attorneyId ? <span style={{ fontSize: 13, color: "var(--text-2)" }}>Attorney assigned</span> : <span className="row gap-1" style={{ fontSize: 13, color: "var(--amber)", fontWeight: 600 }}><span className="pulse-dot" style={{ background: "var(--amber)" }} /> Matching...</span>}
                    </div>
                    <div className="row" style={{ gap: 16 }}>
                      <span className="row gap-1" style={{ fontSize: 12.5, color: "var(--text-3)" }}><Icon name="doc" size={14} /> {c.docs.filter(d => d.status === "done").length}/{c.docs.length} docs</span>
                      <span className="row gap-1" style={{ fontSize: 12.5, color: "var(--signal)", fontWeight: 600 }}>Open <Icon name="arrowR" size={14} /></span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </ClientLayout>
  );
}
