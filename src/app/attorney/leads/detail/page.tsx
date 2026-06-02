"use client";

import { useState } from "react";
import AppLayout from "@/components/attorney-layout";
import { Icon } from "@/components/icons";
import { Avatar, ScoreRing, CaseTag } from "@/components/ui";
import { LEADS, Lead } from "@/lib/data";
import { useRouter } from "next/navigation";

/* module-level selected lead */
let _selected: Lead = LEADS[0];
export function setSelectedLead(l: Lead) {
  _selected = l;
}

export default function LeadDetailPage() {
  const router = useRouter();
  const lead = _selected;
  const [claimed, setClaimed] = useState(false);

  return (
    <AppLayout>
      {/* back */}
      <button
        className="row"
        style={{ gap: 6, fontSize: 14, fontWeight: 600, color: "var(--text-2)", marginBottom: 24, cursor: "pointer" }}
        onClick={() => router.push("/attorney/leads")}
      >
        <Icon name="chevR" size={16} style={{ transform: "rotate(180deg)" }} />
        Back to leads
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
        {/* left column */}
        <div className="stack" style={{ gap: 20 }}>
          {/* lead card */}
          <div className="card" style={{ padding: "28px 30px" }}>
            <div className="row" style={{ gap: 18, marginBottom: 24 }}>
              <Avatar name={lead.name} size={56} />
              <div style={{ flex: 1 }}>
                <div className="row" style={{ gap: 10, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>{lead.name}</h2>
                  <CaseTag type={lead.type} sm />
                </div>
                <div style={{ fontSize: 13.5, color: "var(--text-3)" }}>
                  {lead.id} &middot; {lead.city} &middot; {lead.time}
                </div>
              </div>
            </div>

            {/* scores */}
            <div className="row" style={{ gap: 24, marginBottom: 24 }}>
              <ScoreRing value={lead.quality} size={72} stroke={6} label="Quality" />
              <ScoreRing value={lead.urgency} size={72} stroke={6} label="Urgency" color={lead.urgency >= 80 ? "var(--coral)" : lead.urgency >= 55 ? "var(--amber)" : "var(--text-3)"} />
            </div>

            {/* description */}
            <div style={{ padding: "18px 20px", background: "var(--paper)", borderRadius: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Summary
              </div>
              <p style={{ fontSize: 14.5, color: "var(--text-1)", lineHeight: 1.65 }}>
                {lead.summary}
              </p>
            </div>

            {/* channel */}
            <div className="row" style={{ gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-3)" }}>Channel:</span>
              <span className="pill" style={{ background: "var(--pine-tint)", color: "var(--pine)", fontSize: 12, padding: "4px 10px" }}>
                {lead.channel}
              </span>
            </div>
          </div>

          {/* documents */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>
              <Icon name="file" size={17} style={{ display: "inline", verticalAlign: "-3px", marginRight: 8 }} />
              Documents ({lead.docs})
            </h3>
            {lead.docs > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                {Array.from({ length: lead.docs }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "18px 16px",
                      background: "var(--paper)",
                      borderRadius: 12,
                      textAlign: "center",
                    }}
                  >
                    <Icon name="file" size={28} color="var(--text-3)" style={{ margin: "0 auto 8px" }} />
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)" }}>
                      Document {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: "var(--text-3)" }}>No documents attached.</p>
            )}
          </div>
        </div>

        {/* right column */}
        <div className="stack" style={{ gap: 20 }}>
          {/* claim / claimed */}
          {!claimed ? (
            <div className="card" style={{ padding: "28px 26px", background: "var(--pine)", color: "#fff", border: "none" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Respond & claim</h3>
              <p style={{ fontSize: 13.5, color: "rgba(234,240,249,0.65)", marginBottom: 22, lineHeight: 1.6 }}>
                Claiming this lead will reveal the client's contact info and lock it exclusively to you.
              </p>
              <div style={{ marginBottom: 20 }}>
                <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: "var(--gold-soft)" }}>
                  {lead.value}
                </span>
                <span style={{ fontSize: 13, color: "rgba(234,240,249,0.5)", marginLeft: 8 }}>est. value</span>
              </div>
              <button
                className="btn btn-gold"
                style={{ width: "100%" }}
                onClick={() => setClaimed(true)}
              >
                <Icon name="bolt" size={18} />
                Respond & claim lead
              </button>
            </div>
          ) : (
            <div className="card" style={{ padding: "28px 26px" }}>
              <div className="row" style={{ gap: 8, marginBottom: 16 }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--verified-tint)", display: "grid", placeItems: "center" }}>
                  <Icon name="check" size={16} color="var(--verified)" />
                </span>
                <span style={{ fontWeight: 700, fontSize: 15, color: "var(--verified)" }}>Lead claimed</span>
              </div>

              <div className="stack" style={{ gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Phone</div>
                  <div className="row" style={{ gap: 8 }}>
                    <Icon name="phone" size={16} color="var(--signal)" />
                    <span style={{ fontWeight: 600, fontSize: 15, color: "var(--ink)" }}>{lead.phone}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Consent</div>
                  <div className="row" style={{ gap: 8 }}>
                    <Icon name="check" size={16} color="var(--verified)" />
                    <span style={{ fontSize: 14, color: "var(--text-1)" }}>
                      {lead.consent ? "Client consented to attorney contact" : "No explicit consent"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-signal"
                style={{ width: "100%", marginTop: 20 }}
                onClick={() => router.push("/attorney/messages")}
              >
                <Icon name="message" size={18} />
                Send a message
              </button>
            </div>
          )}

          {/* lead details */}
          <div className="card" style={{ padding: "24px 26px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>Lead details</h3>
            <div className="stack" style={{ gap: 16 }}>
              {[
                { label: "Status", val: lead.status },
                { label: "Case type", val: lead.type },
                { label: "City", val: lead.city },
                { label: "Time received", val: lead.time },
                { label: "Estimated value", val: lead.value },
                { label: "Documents", val: `${lead.docs} attached` },
              ].map((d) => (
                <div key={d.label} className="row between" style={{ fontSize: 13.5 }}>
                  <span style={{ color: "var(--text-3)", fontWeight: 600 }}>{d.label}</span>
                  <span style={{ color: "var(--ink)", fontWeight: 600 }}>{d.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
