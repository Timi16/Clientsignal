"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ClientLayout, { useActiveCase } from "@/components/client-layout";
import { Icon } from "@/components/icons";
import { CaseTag } from "@/components/ui";
import { CASE_TYPES } from "@/lib/data";

const ST: Record<string, [string, string, string, string]> = {
  done: ["Uploaded", "var(--verified)", "var(--verified-tint)", "check"],
  requested: ["Requested by attorney", "var(--amber)", "var(--amber-tint)", "bell"],
  missing: ["Not added yet", "var(--text-3)", "var(--paper-2)", "upload"],
};

export default function ClientDocuments() {
  const router = useRouter();
  const { activeCase: c } = useActiveCase();
  const [items, setItems] = useState(c.docs);
  const [adding, setAdding] = useState("");
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const done = items.filter(i => i.status === "done").length;

  const onFile = (i: number) => {
    setItems(items.map((it, j) => j === i ? { ...it, status: "done", file: it.name.toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".pdf" } : it));
  };
  const addItem = () => { if (!adding.trim()) return; setItems([...items, { name: adding.trim(), status: "missing", file: null, req: false }]); setAdding(""); };
  const removeItem = (i: number) => setItems(items.filter((_, j) => j !== i));

  return (
    <ClientLayout title="Documents">
      <div style={{ maxWidth: 800 }}>
        {/* case context */}
        <div className="row between" style={{ marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div className="row" style={{ gap: 10 }}><CaseTag type={c.type} /><span className="mono" style={{ fontSize: 12.5, color: "var(--text-3)" }}>{c.id}</span></div>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push("/client/cases")}><Icon name="refresh" size={14} /> Switch case</button>
        </div>

        <div className="card" style={{ padding: 22, marginBottom: 18 }}>
          <div className="row between" style={{ marginBottom: 8 }}><strong style={{ fontSize: 16 }}>Your documents &amp; evidence</strong><span className="mono" style={{ fontSize: 13, color: "var(--text-2)" }}>{done} / {items.length} added</span></div>
          <div style={{ height: 8, borderRadius: 999, background: "var(--paper-2)", marginBottom: 6 }}><div style={{ height: "100%", width: `${(done / Math.max(items.length, 1)) * 100}%`, background: "var(--verified)", borderRadius: 999, transition: "width .4s var(--ease)" }} /></div>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Snap a photo or upload a file for each item. More evidence strengthens your case and speeds things up.</p>
        </div>

        {/* document rows */}
        <div className="stack" style={{ gap: 11 }}>
          {items.map((it, i) => {
            const s = ST[it.status] || ST.missing;
            return (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div className="row between" style={{ gap: 12, flexWrap: "wrap" }}>
                  <div className="row" style={{ gap: 13, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: s[2], display: "grid", placeItems: "center", flex: "none" }}><Icon name={it.status === "done" ? "doc" : s[3]} size={19} color={s[1]} /></div>
                    <div className="stack" style={{ gap: 4, minWidth: 0, flex: 1 }}>
                      <div className="row" style={{ gap: 8, minWidth: 0 }}><strong style={{ fontSize: 14.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</strong>{it.req && <span className="pill" style={{ background: "var(--coral-tint)", color: "var(--coral)", fontSize: 10, padding: "2px 7px", flex: "none" }}>Important</span>}</div>
                      <span className="row" style={{ gap: 6, fontSize: 12.5, color: s[1], minWidth: 0 }}><Icon name={s[3]} size={13} /> <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.file || s[0]}</span></span>
                    </div>
                  </div>
                  {it.status === "done" ? (
                    <div className="row" style={{ gap: 6 }}>
                      <button style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--text-2)" }}><Icon name="eye" size={17} /></button>
                      <button onClick={() => removeItem(i)} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--line)", display: "grid", placeItems: "center", color: "var(--text-3)" }}><Icon name="x" size={16} /></button>
                    </div>
                  ) : (
                    <div className="row" style={{ gap: 8 }}>
                      <input ref={el => { fileRefs.current["file" + i] = el; }} type="file" style={{ display: "none" }} onChange={() => onFile(i)} />
                      <button className="btn btn-ghost btn-sm" onClick={() => onFile(i)}><Icon name="eye" size={15} /> Snap</button>
                      <button className="btn btn-signal btn-sm" onClick={() => fileRefs.current["file" + i]?.click()}><Icon name="upload" size={15} /> Upload</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* add a document */}
        <div className="card" style={{ padding: 16, marginTop: 14, border: "1.5px dashed var(--line-2)", background: "var(--paper)" }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, display: "block", marginBottom: 10 }}>Add another document</span>
          <div className="row" style={{ gap: 10 }}>
            <input value={adding} onChange={e => setAdding(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} placeholder="e.g. Witness statement, bank record…" style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid var(--line-2)", background: "var(--card)", fontSize: 14.5, outline: "none" }} />
            <button className="btn btn-pine btn-sm" onClick={addItem} disabled={!adding.trim()} style={{ opacity: adding.trim() ? 1 : 0.5 }}><Icon name="plus" size={15} /> Add</button>
          </div>
        </div>

        <div className="row" style={{ gap: 10, marginTop: 18, padding: 14, borderRadius: 12, background: "var(--blue-tint)" }}>
          <Icon name="lock" size={18} color="var(--signal)" style={{ flex: "none" }} />
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>All uploads are encrypted at rest and shared only with your verified attorney.</span>
        </div>
      </div>
    </ClientLayout>
  );
}
