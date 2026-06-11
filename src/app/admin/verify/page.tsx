"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { Avatar, Verified, CaseTag } from "@/components/ui";
import { ATTORNEYS, CASE_TYPES, RATING } from "@/lib/data";

export default function AdminVerify() {
  const queue = ATTORNEYS.filter(a => a.status !== "approved");
  const [sel, setSel] = useState(0);
  const [decided, setDecided] = useState<Record<string, string>>({});
  const a = queue[sel];
  const decide = (v: string) => setDecided(d => ({ ...d, [a.name]: v }));

  return (
    <AdminLayout title="Attorney verifications" action={<span className="pill" style={{ background: "var(--amber-tint)", color: "var(--amber)" }}><Icon name="clock" size={14} /> 24h SLA</span>}>
      <div style={{ display: "grid", gridTemplateColumns: "330px 1fr", margin: "-32px -32px -48px", minHeight: "calc(100vh - 72px)" }}>
        <div className="thin-scroll" style={{ borderRight: "1px solid var(--line)", overflowY: "auto", background: "var(--card)" }}>
          {queue.map((q, i) => (
            <button key={q.name} onClick={() => setSel(i)} className="row between" style={{ width: "100%", padding: "16px 18px", borderBottom: "1px solid var(--line)", textAlign: "left", background: sel === i ? "var(--pine-tint)" : "transparent" }}>
              <div className="row" style={{ gap: 12 }}><Avatar name={q.name} size={42} /><div className="stack" style={{ gap: 3 }}><strong style={{ fontSize: 14.5 }}>{q.name}</strong><span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{q.bar}</span></div></div>
              {decided[q.name] ? <span className="pill" style={{ background: RATING[decided[q.name] === "approve" ? "green" : "red"][2], color: RATING[decided[q.name] === "approve" ? "green" : "red"][1], fontSize: 10.5, padding: "3px 9px" }}>{decided[q.name] === "approve" ? "Approved" : "Rejected"}</span> : <span className="pill" style={{ background: "var(--amber-tint)", color: "var(--amber)", fontSize: 10.5, padding: "3px 9px" }}>{18 - i * 4}h</span>}
            </button>
          ))}
        </div>
        <div className="thin-scroll" style={{ overflowY: "auto", padding: 30 }}>
          <div className="row between" style={{ marginBottom: 22 }}>
            <div className="row" style={{ gap: 16 }}><Avatar name={a.name} size={60} /><div className="stack" style={{ gap: 5 }}><h2 style={{ fontSize: 22, fontWeight: 700 }}>{a.name}</h2><span style={{ fontSize: 14, color: "var(--text-2)" }}>{a.firm} · joined {a.joined}</span></div></div>
            <div className="stack" style={{ alignItems: "flex-end", gap: 6 }}><span className="eyebrow">Time remaining</span><strong className="mono" style={{ fontSize: 24, color: "var(--amber)" }}>{18 - sel * 4}h 12m</strong></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div className="card" style={{ padding: 20 }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 14 }}>Submitted details</strong>
              <div className="stack" style={{ gap: 11 }}>
                {([["Bar number", a.bar], ["Firm", a.firm], ["Practice areas", a.specialties.map(s => CASE_TYPES[s]?.label).join(", ")], ["Work email", `${a.name.split(" ")[0].toLowerCase()}@${a.firm.toLowerCase().replace(/[^a-z]/g, "")}.com`], ["State bar status", "Active · good standing"]] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="row between" style={{ fontSize: 13.5 }}><span style={{ color: "var(--text-3)" }}>{k}</span><strong style={{ textAlign: "right", maxWidth: 200 }}>{v}</strong></div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 14 }}>License document</strong>
              <div style={{ borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper-2)", height: 132, display: "grid", placeItems: "center", marginBottom: 12 }}>
                  <div className="stack" style={{ alignItems: "center", gap: 8 }}><Icon name="doc" size={30} color="var(--pine)" /><span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>Bar_license_{a.bar.split(" ")[0]}.pdf</span></div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ width: "100%" }}><Icon name="eye" size={15} /> Open document</button>
            </div>
          </div>

          {/* rating */}
          <div className="card" style={{ padding: 22, marginBottom: 18 }}>
            <strong style={{ fontSize: 14, display: "block", marginBottom: 6 }}>Trust rating</strong>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 14 }}>Green can approve, Yellow requires manual review, and Red should be rejected or sent back for more information.</p>
            <div className="row" style={{ gap: 11 }}>
              {Object.entries(RATING).map(([k, [l, c, t]]) => (
                <div key={k} className="row" style={{ gap: 9, flex: 1, padding: "13px 16px", borderRadius: 12, background: t, border: `1.5px solid ${k === a.rating ? c : "transparent"}` }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                  <strong style={{ fontSize: 14, color: c }}>{l}</strong>
                  {k === a.rating && <Icon name="check" size={16} color={c} stroke={2.5} style={{ marginLeft: "auto" }} />}
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 22, marginBottom: 18 }}>
            <strong style={{ fontSize: 14, display: "block", marginBottom: 14 }}>24-hour verification checklist</strong>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="dash-grid">
              {[
                "Name matches bar record",
                "Bar number matches state database",
                "License status is Active",
                "No suspension or disbarment",
                "Work email domain matches firm",
                "Phone verified by SMS",
                "Firm website lists attorney",
                "Uploaded documents are readable",
                "Discipline and risk flags reviewed",
                "Verification timestamp recorded",
              ].map((item) => (
                <div key={item} className="row" style={{ gap: 9, fontSize: 13.5, color: "var(--text-2)" }}>
                  <Icon name="check" size={15} color="var(--verified)" stroke={2.5} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* decision */}
          {decided[a.name] ? (
            <div className="card" style={{ padding: 18, background: decided[a.name] === "approve" ? "var(--verified-tint)" : "var(--coral-tint)", border: "none" }}>
              <div className="row" style={{ gap: 10 }}><Icon name={decided[a.name] === "approve" ? "check" : "x"} size={20} color={decided[a.name] === "approve" ? "var(--verified)" : "var(--coral)"} stroke={2.5} /><strong style={{ color: decided[a.name] === "approve" ? "var(--verified)" : "var(--coral)" }}>{a.name} has been {decided[a.name] === "approve" ? "approved & notified" : "rejected"}.</strong></div>
            </div>
          ) : (
            <div className="row" style={{ gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1, color: "var(--coral)", borderColor: "var(--coral)" }} onClick={() => decide("reject")}><Icon name="x" size={17} /> Reject</button>
              <button className="btn btn-pine" style={{ flex: 2 }} onClick={() => decide("approve")}><Icon name="check" size={17} /> Approve &amp; activate Verified Attorney badge</button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
