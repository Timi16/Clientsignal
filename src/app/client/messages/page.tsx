"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientLayout, { useActiveCase, ME } from "@/components/client-layout";
import { Icon } from "@/components/icons";
import { Avatar, Mark, Verified, CaseTag } from "@/components/ui";
import { CASE_TYPES, CLIENT_ATTYS } from "@/lib/data";

export default function ClientMessages() {
  const router = useRouter();
  const { activeCase: c } = useActiveCase();
  const atty = c.atty ? CLIENT_ATTYS[c.atty] : null;
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState(atty ? [
    { me: false, t: `Hi ${ME.name.split(" ")[0]}, I'm ${atty.name} — I've reviewed your case and I'm glad to help.`, time: "10:05" },
    { me: false, t: "Could you tell me a bit more about where things stand right now?", time: "10:05" },
    { me: true, t: "Thanks for reaching out. Yes — happy to share whatever you need.", time: "10:12" },
  ] : []);
  const send = () => { if (!draft.trim()) return; setMsgs([...msgs, { me: true, t: draft, time: "now" }]); setDraft(""); };

  if (!atty) {
    return (
      <ClientLayout title="Messages">
        <div style={{ height: "100%", display: "grid", placeItems: "center", padding: 30 }}>
          <div className="stack" style={{ alignItems: "center", gap: 16, textAlign: "center", maxWidth: 360 }}>
            <Mark size={52} live />
            <h2 className="display" style={{ fontSize: 26 }}>No attorney yet.</h2>
            <p style={{ color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.5 }}>Once your {CASE_TYPES[c.type]?.label.toLowerCase()} case is matched, a secure message thread with your attorney opens here.</p>
            <button className="btn btn-pine" onClick={() => router.push("/client/timeline")}>Track matching progress</button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Messages">
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", background: "var(--paper)", margin: "-28px -32px", }}>
        <div className="row between" style={{ padding: "16px 24px", borderBottom: "1px solid var(--line)", background: "var(--card)" }}>
          <div className="row" style={{ gap: 12 }}><Avatar name={atty.name} size={44} /><div className="stack"><div className="row" style={{ gap: 7 }}><strong style={{ fontSize: 15.5 }}>{atty.name}</strong><Verified size={15} /><CaseTag type={c.type} sm /></div><span style={{ fontSize: 12.5, color: "var(--verified)" }}>● Online · typically replies in {atty.responses}</span></div></div>
          <div className="row" style={{ gap: 9 }}><button className="btn btn-ghost btn-sm"><Icon name="phone" size={15} /> Call</button><button className="btn btn-pine btn-sm"><Icon name="clock" size={15} /> Book consult</button></div>
        </div>
        <div className="thin-scroll" style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ textAlign: "center" }}><span className="mono" style={{ fontSize: 11, color: "var(--text-3)", background: "var(--paper-2)", padding: "4px 12px", borderRadius: 999 }}>Connected via ClientSignal · {c.id}</span></div>
          {msgs.map((m, i) => (
            <div key={i} style={{ alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "72%" }}>
              <div style={{ padding: "12px 16px", borderRadius: m.me ? "16px 16px 5px 16px" : "16px 16px 16px 5px", background: m.me ? "var(--signal)" : "var(--card)", color: m.me ? "#fff" : "var(--ink)", border: m.me ? "none" : "1px solid var(--line)", fontSize: 14.5, lineHeight: 1.5 }}>{m.t}</div>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", display: "block", marginTop: 4, textAlign: m.me ? "right" : "left" }}>{m.time}</span>
            </div>
          ))}
        </div>
        <div className="row" style={{ padding: 18, gap: 11, borderTop: "1px solid var(--line)", background: "var(--card)" }}>
          <button style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid var(--line-2)", display: "grid", placeItems: "center", flex: "none", color: "var(--text-2)" }} onClick={() => router.push("/client/documents")}><Icon name="upload" size={18} /></button>
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Message your attorney…" style={{ flex: 1, padding: "13px 18px", borderRadius: 999, border: "1px solid var(--line-2)", background: "var(--paper)", fontSize: 14.5, outline: "none" }} />
          <button className="btn btn-signal" onClick={send} style={{ padding: "13px 18px" }}><Icon name="arrowR" size={18} /></button>
        </div>
      </div>
    </ClientLayout>
  );
}
