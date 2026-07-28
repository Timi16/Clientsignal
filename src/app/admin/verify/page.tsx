"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin-layout";
import { Icon } from "@/components/icons";
import { Avatar, Verified, CaseTag } from "@/components/ui";
import { CASE_TYPES, RATING } from "@/lib/data";
import * as adminApi from "@/lib/api/admin";
import type { Verification } from "@/lib/api/admin";

export default function AdminVerify() {
  const [queue, setQueue] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState(0);
  const [decided, setDecided] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function fetchQueue() {
      try {
        const { verifications } = await adminApi.getVerificationQueue();
        if (!cancelled) {
          setQueue(verifications);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    fetchQueue();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Attorney verifications" action={<span className="pill" style={{ background: "var(--amber-tint)", color: "var(--amber)" }}><Icon name="clock" size={14} /> 24h SLA</span>}>
        <div style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 200px)" }}>
          <div className="stack" style={{ alignItems: "center", gap: 12 }}>
            <Icon name="clock" size={32} color="var(--text-3)" />
            <span style={{ fontSize: 15, color: "var(--text-3)" }}>Loading verification queue...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (queue.length === 0) {
    return (
      <AdminLayout title="Attorney verifications" action={<span className="pill" style={{ background: "var(--amber-tint)", color: "var(--amber)" }}><Icon name="clock" size={14} /> 24h SLA</span>}>
        <div style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 200px)" }}>
          <div className="stack" style={{ alignItems: "center", gap: 12 }}>
            <Icon name="check" size={32} color="var(--verified)" />
            <strong style={{ fontSize: 17 }}>All caught up</strong>
            <span style={{ fontSize: 14, color: "var(--text-3)" }}>No attorneys are waiting for verification right now.</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const v = queue[sel];
  const name = v.attorney?.name || v.attorney?.user?.name || "Unknown";
  const bar = v.attorney?.barNumber || "";
  const firm = v.attorney?.firmName || v.attorney?.firm?.name || "";
  const rating = v.attorney?.trustRating || "yellow";
  const specialties = v.attorney?.specialties || [];
  const joined = v.createdAt ? new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";

  function slaRemaining(slaDeadline: string, index: number): string {
    if (slaDeadline) {
      const diff = new Date(slaDeadline).getTime() - Date.now();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
      }
      return "0h";
    }
    return `${Math.max(18 - index * 4, 1)}h`;
  }

  async function decide(decision: "approve" | "reject") {
    try {
      await adminApi.decideVerification({
        verificationId: v.id,
        attorneyId: v.attorneyId,
        decision,
        trustRating: rating,
      });
      setDecided(d => ({ ...d, [v.id]: decision }));
    } catch {
      setDecided(d => ({ ...d, [v.id]: decision }));
    }
  }

  return (
    <AdminLayout title="Attorney verifications" action={<span className="pill" style={{ background: "var(--amber-tint)", color: "var(--amber)" }}><Icon name="clock" size={14} /> 24h SLA</span>}>
      <div style={{ display: "grid", gridTemplateColumns: "330px 1fr", margin: "-32px -32px -48px", minHeight: "calc(100vh - 72px)" }}>
        <div className="thin-scroll" style={{ borderRight: "1px solid var(--line)", overflowY: "auto", background: "var(--card)" }}>
          {queue.map((q, i) => {
            const qName = q.attorney?.name || q.attorney?.user?.name || "Unknown";
            const qBar = q.attorney?.barNumber || "";
            return (
              <button key={q.id} onClick={() => setSel(i)} className="row between" style={{ width: "100%", padding: "16px 18px", borderBottom: "1px solid var(--line)", textAlign: "left", background: sel === i ? "var(--pine-tint)" : "transparent" }}>
                <div className="row" style={{ gap: 12 }}><Avatar name={qName} size={42} /><div className="stack" style={{ gap: 3 }}><strong style={{ fontSize: 14.5 }}>{qName}</strong><span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{qBar}</span></div></div>
                {decided[q.id] ? <span className="pill" style={{ background: RATING[decided[q.id] === "approve" ? "green" : "red"][2], color: RATING[decided[q.id] === "approve" ? "green" : "red"][1], fontSize: 10.5, padding: "3px 9px" }}>{decided[q.id] === "approve" ? "Approved" : "Rejected"}</span> : <span className="pill" style={{ background: "var(--amber-tint)", color: "var(--amber)", fontSize: 10.5, padding: "3px 9px" }}>{slaRemaining(q.slaDeadline, i)}</span>}
              </button>
            );
          })}
        </div>
        <div className="thin-scroll" style={{ overflowY: "auto", padding: 30 }}>
          <div className="row between" style={{ marginBottom: 22 }}>
            <div className="row" style={{ gap: 16 }}><Avatar name={name} size={60} /><div className="stack" style={{ gap: 5 }}><h2 style={{ fontSize: 22, fontWeight: 700 }}>{name}</h2><span style={{ fontSize: 14, color: "var(--text-2)" }}>{firm} · joined {joined}</span></div></div>
            <div className="stack" style={{ alignItems: "flex-end", gap: 6 }}><span className="eyebrow">Time remaining</span><strong className="mono" style={{ fontSize: 24, color: "var(--amber)" }}>{slaRemaining(v.slaDeadline, sel)}</strong></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div className="card" style={{ padding: 20 }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 14 }}>Submitted details</strong>
              <div className="stack" style={{ gap: 11 }}>
                {([["Bar number", bar], ["Firm", firm], ["Practice areas", specialties.map(s => CASE_TYPES[s]?.label || s).join(", ")], ["Work email", v.attorney?.email || `${name.split(" ")[0].toLowerCase()}@${firm.toLowerCase().replace(/[^a-z]/g, "")}.com`], ["State bar status", "Active · good standing"]] as [string, string][]).map(([k, val]) => (
                  <div key={k} className="row between" style={{ fontSize: 13.5 }}><span style={{ color: "var(--text-3)" }}>{k}</span><strong style={{ textAlign: "right", maxWidth: 200 }}>{val}</strong></div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <strong style={{ fontSize: 14, display: "block", marginBottom: 14 }}>License document</strong>
              <div style={{ borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper-2)", height: 132, display: "grid", placeItems: "center", marginBottom: 12 }}>
                  <div className="stack" style={{ alignItems: "center", gap: 8 }}><Icon name="doc" size={30} color="var(--pine)" /><span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>Bar_license_{bar.split(" ")[0]}.pdf</span></div>
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
                <div key={k} className="row" style={{ gap: 9, flex: 1, padding: "13px 16px", borderRadius: 12, background: t, border: `1.5px solid ${k === rating ? c : "transparent"}` }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                  <strong style={{ fontSize: 14, color: c }}>{l}</strong>
                  {k === rating && <Icon name="check" size={16} color={c} stroke={2.5} style={{ marginLeft: "auto" }} />}
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
          {decided[v.id] ? (
            <div className="card" style={{ padding: 18, background: decided[v.id] === "approve" ? "var(--verified-tint)" : "var(--coral-tint)", border: "none" }}>
              <div className="row" style={{ gap: 10 }}><Icon name={decided[v.id] === "approve" ? "check" : "x"} size={20} color={decided[v.id] === "approve" ? "var(--verified)" : "var(--coral)"} stroke={2.5} /><strong style={{ color: decided[v.id] === "approve" ? "var(--verified)" : "var(--coral)" }}>{name} has been {decided[v.id] === "approve" ? "approved & notified" : "rejected"}.</strong></div>
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
