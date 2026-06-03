"use client";

import { useRouter } from "next/navigation";
import ClientLayout, { useActiveCase } from "@/components/client-layout";
import { Icon } from "@/components/icons";
import { Avatar, Mark, Verified, CaseTag } from "@/components/ui";
import { CASE_TYPES, CLIENT_ATTYS } from "@/lib/data";

export default function ClientAttorney() {
  const router = useRouter();
  const { activeCase: c } = useActiveCase();
  const a = c.atty ? CLIENT_ATTYS[c.atty] : null;

  if (!a) {
    return (
      <ClientLayout title="My Attorney">
        <div style={{ height: "100%", display: "grid", placeItems: "center", padding: 30 }}>
          <div className="stack" style={{ alignItems: "center", gap: 16, textAlign: "center", maxWidth: 360 }}>
            <Mark size={52} live />
            <h2 className="display" style={{ fontSize: 26 }}>Matching in progress.</h2>
            <p style={{ color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.5 }}>We&apos;re finding the best verified attorney for your {CASE_TYPES[c.type]?.label.toLowerCase()} case. Their profile will appear here once matched.</p>
            <button className="btn btn-pine" onClick={() => router.push("/client/timeline")}>Track progress</button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="My Attorney">
      <div style={{ maxWidth: 760 }}>
        <div className="card" style={{ overflow: "hidden", marginBottom: 18 }}>
          <div style={{ height: 110, background: "var(--pine)", position: "relative" }}><div className="gridlines" style={{ position: "absolute", inset: 0 }} /></div>
          <div style={{ padding: "0 28px 26px", marginTop: -44 }}>
            <div className="row between" style={{ alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
              <div className="row" style={{ gap: 16, alignItems: "flex-end" }}>
                <div style={{ border: "4px solid var(--card)", borderRadius: "50%" }}><Avatar name={a.name} size={92} /></div>
                <div className="stack" style={{ gap: 5, paddingBottom: 6 }}>
                  <div className="row" style={{ gap: 8 }}><h2 style={{ fontSize: 23, fontWeight: 700 }}>{a.name}</h2><Verified size={18} /></div>
                  <span style={{ fontSize: 14, color: "var(--text-2)" }}>{a.firm}</span>
                </div>
              </div>
              <div className="row" style={{ gap: 10, paddingBottom: 6 }}>
                <button className="btn btn-ghost btn-sm"><Icon name="phone" size={15} /> Call</button>
                <button className="btn btn-signal btn-sm" onClick={() => router.push("/client/messages")}><Icon name="message" size={15} /> Message</button>
              </div>
            </div>
            <span className="pill" style={{ background: "var(--gold-tint)", color: "var(--gold-text)", border: "1px solid var(--gold-border)", marginTop: 16 }}><Verified size={14} /> Verified Attorney — License Confirmed</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 18 }} className="stat-grid">
          {([["Experience", a.years + " yrs"], ["Bar number", a.bar], ["Rating", a.rating + " ★"], ["Avg reply", a.responses]] as [string, string][]).map(([l, v]) => (
            <div key={l} className="card" style={{ padding: 18, textAlign: "center" }}><span className="eyebrow" style={{ fontSize: 10 }}>{l}</span><strong className="mono" style={{ fontSize: 19, display: "block", marginTop: 7 }}>{v}</strong></div>
          ))}
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 18 }}>
          <strong style={{ fontSize: 15, display: "block", marginBottom: 10 }}>About</strong>
          <p style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.65 }}>{a.bio}</p>
          <div className="row" style={{ gap: 8, marginTop: 16, flexWrap: "wrap" }}>{a.areas.map(ar => <CaseTag key={ar} type={ar} sm />)}</div>
        </div>

        <div className="card" style={{ padding: 20, background: "var(--blue-tint)", border: "1px solid var(--blue-tint)" }}>
          <div className="row" style={{ gap: 12 }}>
            <Icon name="shield" size={22} color="var(--signal)" style={{ flex: "none" }} />
            <div className="stack" style={{ gap: 3 }}><strong style={{ fontSize: 14.5 }}>Why you can trust this match</strong><span style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.5 }}>{a.name.split(" ")[0]}&apos;s bar license, identity, and firm were verified by ClientSignal within 24 hours of joining. Your case is exclusive — {a.name.split(" ")[0]} is the only attorney handling it.</span></div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
