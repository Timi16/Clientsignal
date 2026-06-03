"use client";

import { useRouter } from "next/navigation";
import ClientLayout, { useActiveCase } from "@/components/client-layout";
import { Icon } from "@/components/icons";
import { Avatar, Mark, Verified, CaseTag, ScoreRing } from "@/components/ui";
import { CASE_STATUS, CASE_TYPES, CLIENT_ATTYS } from "@/lib/data";

export default function ClientAttorney() {
  const router = useRouter();
  const { activeCase: c } = useActiveCase();
  const a = c.atty ? CLIENT_ATTYS[c.atty] : null;

  if (!a) {
    return (
      <ClientLayout title="My Attorney">
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 22 }} className="dash-grid">
          <div className="card" style={{ padding: 34, minHeight: 360, background: "var(--pine)", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div className="gridlines" style={{ position: "absolute", inset: 0 }} />
            <div className="stack" style={{ position: "relative", gap: 20, maxWidth: 560 }}>
              <Mark size={62} live />
              <div className="stack" style={{ gap: 10 }}>
                <span className="eyebrow" style={{ color: "var(--signal-glow)" }}>Attorney matching</span>
                <h2 className="display" style={{ fontSize: "clamp(34px,4.6vw,48px)", color: "#fff" }}>We&apos;re finding the right attorney.</h2>
                <p style={{ color: "rgba(234,240,249,0.72)", fontSize: 16, lineHeight: 1.65 }}>
                  Your {CASE_TYPES[c.type]?.label.toLowerCase()} matter is being reviewed against attorney availability, location, and practice fit.
                </p>
              </div>
              <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
                <button className="btn btn-signal" onClick={() => router.push("/client/timeline")}><Icon name="clock" size={16} /> Track progress</button>
                <button className="btn btn-ghost-light" onClick={() => router.push("/client/documents")}><Icon name="upload" size={16} /> Add documents</button>
              </div>
            </div>
          </div>

          <div className="stack" style={{ gap: 18 }}>
            {[
              ["Case type", CASE_TYPES[c.type]?.label || c.type, "scale"],
              ["Location", c.city, "flag"],
              ["Case strength", `${c.strength}%`, "zap"],
            ].map(([label, value, icon]) => (
              <div key={label} className="card" style={{ padding: 22, minHeight: 104 }}>
                <div className="row" style={{ gap: 12 }}>
                  <span style={{ width: 42, height: 42, borderRadius: 10, background: "var(--blue-tint)", color: "var(--signal)", display: "grid", placeItems: "center", flex: "none" }}>
                    <Icon name={icon} size={19} />
                  </span>
                  <div className="stack" style={{ gap: 2 }}>
                    <span className="eyebrow" style={{ fontSize: 10 }}>{label}</span>
                    <strong style={{ fontSize: 16 }}>{value}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="My Attorney">
      <div className="stack" style={{ gap: 22 }}>
        <div className="card" style={{ overflow: "hidden", boxShadow: "var(--sh-sm)" }}>
          <div style={{ minHeight: 166, background: "linear-gradient(135deg, var(--pine) 0%, var(--pine-soft) 100%)", position: "relative", color: "#fff", padding: "34px 34px 48px" }}>
            <div className="gridlines" style={{ position: "absolute", inset: 0 }} />
            <div className="row between" style={{ position: "relative", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div className="stack" style={{ gap: 10, maxWidth: 560 }}>
                <span className="pill" style={{ background: "rgba(37,99,235,0.18)", color: "#BFDBFE", alignSelf: "flex-start" }}><Verified size={14} /> Verified match</span>
                <h2 className="display" style={{ fontSize: "clamp(34px,4.6vw,52px)", color: "#fff" }}>{a.name}</h2>
                <p style={{ color: "rgba(234,240,249,0.72)", fontSize: 16, lineHeight: 1.55 }}>
                  {a.firm} {c.status === "closed" ? "handled" : "is handling"} your {CASE_TYPES[c.type]?.label.toLowerCase()} matter in {c.city}.
                </p>
              </div>
              <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
                <button className="btn btn-ghost-light" onClick={() => router.push("/client/messages")}><Icon name="phone" size={16} /> Call office</button>
                <button className="btn btn-signal" onClick={() => router.push("/client/messages")}><Icon name="message" size={16} /> Message</button>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 34px 30px", marginTop: -26, position: "relative", zIndex: 1 }}>
            <div className="row between" style={{ gap: 20, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div className="row" style={{ gap: 18, alignItems: "flex-end" }}>
                <div style={{ border: "5px solid var(--card)", borderRadius: "50%", boxShadow: "var(--sh-md)" }}><Avatar name={a.name} size={112} /></div>
                <div className="stack" style={{ gap: 6, padding: "14px 0 10px" }}>
                  <div className="row" style={{ gap: 8 }}><strong style={{ fontSize: 24, color: "var(--ink)" }}>{a.name}</strong><Verified size={18} /></div>
                  <span style={{ fontSize: 14.5, color: "var(--text-2)" }}>{a.firm} · {a.years} years experience</span>
                  <div className="row" style={{ gap: 8, flexWrap: "wrap", marginTop: 4 }}>{a.areas.map(ar => <CaseTag key={ar} type={ar} sm />)}</div>
                </div>
              </div>
              <div className="row" style={{ gap: 14, paddingBottom: 12, flexWrap: "wrap" }}>
                {[
                  ["Rating", a.rating + " / 5", "star"],
                  ["Avg reply", a.responses, "clock"],
                  ["Bar number", a.bar, "shield"],
                ].map(([label, value, icon]) => (
                  <div key={label} style={{ minWidth: 138, padding: "14px 16px", border: "1px solid var(--line)", borderRadius: 12, background: "#fff", boxShadow: "var(--sh-sm)" }}>
                    <div className="row" style={{ gap: 8, color: "var(--signal)", marginBottom: 6 }}><Icon name={icon} size={16} /><span className="eyebrow" style={{ fontSize: 9.5 }}>{label}</span></div>
                    <strong className="mono" style={{ fontSize: 15.5, color: "var(--ink)" }}>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr", gap: 22 }} className="dash-grid">
          <div className="stack" style={{ gap: 22 }}>
            <div className="card" style={{ padding: 28, minHeight: 214 }}>
              <strong style={{ fontSize: 17, display: "block", marginBottom: 12 }}>About your attorney</strong>
              <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.7 }}>{a.bio}</p>
            </div>

            <div className="card" style={{ padding: 28, minHeight: 232 }}>
              <div className="row between" style={{ gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
                <strong style={{ fontSize: 17 }}>What {a.name.split(" ")[0]} is handling</strong>
                <span className="pill" style={{ background: "var(--blue-tint)", color: "var(--signal)" }}>{CASE_TYPES[c.type]?.label}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="stat-grid">
                {[
                  ["Matter", c.matter, "scale"],
                  ["Location", c.city, "flag"],
                  ["Opened", c.opened, "clock"],
                  ["Status", CASE_STATUS[c.status]?.label || c.status, "eye"],
                ].map(([label, value, icon]) => (
                  <div key={label} style={{ padding: 16, border: "1px solid var(--line)", borderRadius: 12, background: "var(--paper)" }}>
                    <div className="row" style={{ gap: 9, marginBottom: 8, color: "var(--signal)" }}><Icon name={icon} size={17} /><span className="eyebrow" style={{ fontSize: 10 }}>{label}</span></div>
                    <strong style={{ fontSize: 14.5, color: "var(--ink)" }}>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="stack" style={{ gap: 22 }}>
            <div className="card" style={{ padding: 26, minHeight: 250 }}>
              <strong style={{ fontSize: 16, display: "block", marginBottom: 18 }}>Contact plan</strong>
              <div className="stack" style={{ gap: 14 }}>
                {[
                  ["Secure message", "Best for updates, documents, and non-urgent questions.", "message"],
                  ["Phone consult", "Use messaging to request a call time before calling.", "phone"],
                  ["Documents", "Upload requested evidence so the attorney can move faster.", "upload"],
                ].map(([title, desc, icon]) => (
                  <div key={title} className="row" style={{ gap: 12, alignItems: "flex-start" }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: "var(--blue-tint)", color: "var(--signal)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={icon} size={17} /></span>
                    <div className="stack" style={{ gap: 2 }}><strong style={{ fontSize: 14 }}>{title}</strong><span style={{ fontSize: 12.8, color: "var(--text-2)", lineHeight: 1.45 }}>{desc}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 26, minHeight: 224, background: "var(--blue-tint)", border: "1px solid rgba(37,99,235,0.14)" }}>
              <div className="row" style={{ gap: 14, alignItems: "flex-start" }}>
                <ScoreRing value={c.strength} size={62} stroke={6} color="var(--signal)" />
                <div className="stack" style={{ gap: 6 }}>
                  <strong style={{ fontSize: 16 }}>Why you can trust this match</strong>
                  <span style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.55 }}>
                    {a.name.split(" ")[0]}&apos;s bar license, identity, and firm were verified by ClientSignal. Your case is exclusive to this attorney inside the platform.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
