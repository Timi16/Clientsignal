"use client";

import { useRouter } from "next/navigation";
import ClientLayout, { useActiveCase, ME } from "@/components/client-layout";
import { Icon } from "@/components/icons";
import { Avatar, Mark, Verified, ScoreRing, CaseTag } from "@/components/ui";
import StageTracker from "@/components/stage-tracker";
import { CASE_STATUS, CASE_TYPES, CLIENT_ATTYS, CLIENT_CASES } from "@/lib/data";

export default function ClientDashboard() {
  const router = useRouter();
  const { activeCase: c } = useActiveCase();
  const st = CASE_STATUS[c.status];
  const atty = c.atty ? CLIENT_ATTYS[c.atty] : null;
  const docsNeeded = c.docs.filter(d => d.status !== "done");
  const docsDone = c.docs.filter(d => d.status === "done").length;

  const nextSteps: { t: string; d: string; icon: string; cta: string; dest: string; hot: boolean }[] = [];
  if (c.unread) nextSteps.push({ t: `Reply to ${atty ? atty.name.split(" ")[0] + "'s" : "your attorney's"} message`, d: "They're waiting to hear back from you", icon: "message", cta: "Reply", dest: "/client/messages", hot: true });
  docsNeeded.filter(d => d.status === "requested").forEach(d => nextSteps.push({ t: `Upload: ${d.name}`, d: "Requested by your attorney", icon: "upload", cta: "Upload", dest: "/client/documents", hot: !c.unread }));
  if (c.status === "matched") nextSteps.push({ t: "Book your free consultation", d: "Pick a time that works for you", icon: "clock", cta: "Book", dest: "/client/messages", hot: false });
  if (c.status === "pending") nextSteps.push({ t: "We're finding your attorney", d: "You'll be notified the moment you're matched", icon: "zap", cta: "View", dest: "/client/timeline", hot: true });
  while (nextSteps.length < 2) nextSteps.push({ t: "Add more case details", d: "Stronger detail means a stronger match", icon: "pen", cta: "Edit", dest: "/client/documents", hot: false });
  const primaryStep = nextSteps[0];

  return (
    <ClientLayout title="My Case">
      <div className="row between" style={{ gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div className="stack" style={{ gap: 4 }}>
          <h2 className="display" style={{ fontSize: 30 }}>Hi {ME.name.split(" ")[0]} — {c.status === "pending" ? "we're on it." : c.status === "closed" ? "welcome back." : "good news."}</h2>
          <p style={{ color: "var(--text-2)", fontSize: 15.5 }}>{c.status === "pending" ? "We're matching your case with the right verified attorney now." : c.status === "matched" && atty ? `${atty.name} has been matched to your case.` : c.status === "closed" ? "This case is closed. Start a new one anytime." : atty ? `${atty.name} is working with you on this case.` : "Working on your case."}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => router.push("/client/cases")}><Icon name="inbox" size={15} /> All cases ({CLIENT_CASES.length})</button>
      </div>

      {/* status / stage tracker */}
      <div className="card" style={{ padding: 26, marginBottom: 18 }}>
        <div className="row between" style={{ marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
          <div className="row" style={{ gap: 10 }}>
            <span className="pill" style={{ background: st.tint, color: st.color }}><span className="pulse-dot" style={{ background: st.dot }} /> {st.label}</span>
            <CaseTag type={c.type} sm />
          </div>
          <span className="mono" style={{ fontSize: 12.5, color: "var(--text-3)" }}>Case {c.id} · opened {c.opened}</span>
        </div>
        <StageTracker stage={c.stage} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }} className="stat-grid">
        {[
          ["Attorney", atty ? atty.name : "Matching", atty ? atty.responses + " reply" : "In progress", "user", "var(--signal)"],
          ["Documents", `${docsDone}/${c.docs.length} added`, docsNeeded.length ? `${docsNeeded.length} still needed` : "Complete", "doc", docsNeeded.length ? "var(--amber)" : "var(--verified)"],
          ["Next action", primaryStep.cta, primaryStep.t, primaryStep.icon, primaryStep.hot ? "var(--signal)" : "var(--pine)"],
          ["Case strength", `${c.strength}%`, c.strength >= 80 ? "Strong details" : "Add more detail", "zap", c.strength >= 80 ? "var(--verified)" : "var(--amber)"],
        ].map(([label, value, detail, icon, color]) => (
          <button
            key={label}
            className="card"
            onClick={() => {
              if (label === "Attorney") router.push("/client/attorney");
              if (label === "Documents") router.push("/client/documents");
              if (label === "Next action") router.push(primaryStep.dest);
              if (label === "Case strength") router.push("/client/documents");
            }}
            style={{
              padding: 20,
              minHeight: 132,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform .15s, box-shadow .15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "var(--sh-md)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div className="row between" style={{ gap: 12 }}>
              <span className="eyebrow" style={{ fontSize: 10 }}>{label}</span>
              <span style={{ color }}><Icon name={icon} size={18} /></span>
            </div>
            <div className="stack" style={{ gap: 5 }}>
              <strong style={{ fontSize: 17, color: "var(--ink)" }}>{value}</strong>
              <span style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.35 }}>{detail}</span>
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 22 }} className="dash-grid">
        {/* left: next steps + attorney */}
        <div className="stack" style={{ gap: 22 }}>
          {atty ? (
            <div className="card" style={{ padding: 30, minHeight: 226, background: "var(--pine)", color: "#fff" }}>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>Your attorney</span>
              <div className="row" style={{ gap: 17, marginTop: 18 }}>
                <Avatar name={atty.name} size={60} />
                <div className="stack" style={{ gap: 4 }}>
                  <div className="row" style={{ gap: 7 }}><strong style={{ fontSize: 18 }}>{atty.name}</strong><Verified size={16} /></div>
                  <span style={{ fontSize: 13.5, color: "rgba(234,240,249,0.72)" }}>{atty.firm} · {atty.years} yrs</span>
                  <span className="pill" style={{ background: "rgba(212,160,23,0.18)", color: "var(--gold-soft)", fontSize: 11, padding: "3px 9px", marginTop: 4 }}>Verified Attorney — License Confirmed</span>
                </div>
              </div>
              <div className="row" style={{ gap: 12, marginTop: 24 }}>
                <button className="btn btn-signal" style={{ flex: 1 }} onClick={() => router.push("/client/messages")}><Icon name="message" size={16} /> Message {atty.name.split(" ")[0]}</button>
                <button className="btn btn-ghost-light" onClick={() => router.push("/client/attorney")}>View profile</button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 30, minHeight: 226, background: "var(--pine)", color: "#fff", textAlign: "center" }}>
              <div className="stack" style={{ alignItems: "center", gap: 12 }}>
                <Mark size={48} live />
                <strong style={{ fontSize: 17 }}>Finding your attorney…</strong>
                <p style={{ fontSize: 13.5, color: "rgba(234,240,249,0.7)", lineHeight: 1.5, maxWidth: 320 }}>We&apos;re matching your {CASE_TYPES[c.type]?.label.toLowerCase()} case with a verified attorney in {c.city}. You&apos;ll be notified the moment we do.</p>
                <button className="btn btn-signal btn-sm" onClick={() => router.push("/client/timeline")}>Track progress</button>
              </div>
            </div>
          )}

          {/* next steps */}
          <div className="card" style={{ padding: 26, minHeight: 310 }}>
            <div className="row between" style={{ marginBottom: 20 }}>
              <strong style={{ fontSize: 16 }}>What to do next</strong>
              <button onClick={() => router.push("/client/documents")} style={{ fontSize: 13, color: "var(--signal)", fontWeight: 600 }} className="row gap-1">Documents <Icon name="arrowR" size={14} /></button>
            </div>
            <div className="stack" style={{ gap: 14 }}>
              {nextSteps.slice(0, 3).map((s, i) => (
                <div key={i} className="row between" style={{ padding: 18, minHeight: 78, borderRadius: 12, border: "1px solid var(--line)", background: s.hot ? "var(--blue-tint)" : "var(--card)" }}>
                  <div className="row" style={{ gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: s.hot ? "var(--signal)" : "var(--paper-2)", color: s.hot ? "#fff" : "var(--pine)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={s.icon} size={18} /></div>
                    <div className="stack" style={{ gap: 1 }}><strong style={{ fontSize: 14.5 }}>{s.t}</strong><span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{s.d}</span></div>
                  </div>
                  <button className={"btn btn-sm " + (s.hot ? "btn-signal" : "btn-ghost")} onClick={() => router.push(s.dest)}>{s.cta}</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right: case summary */}
        <div className="stack" style={{ gap: 22 }}>
          <div className="card" style={{ padding: 26, minHeight: 420 }}>
            <strong style={{ fontSize: 15, display: "block", marginBottom: 18 }}>Case summary</strong>
            <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.65, marginBottom: 20 }}>{c.summary}</p>
            <div className="stack" style={{ gap: 15 }}>
              {([["Type", CASE_TYPES[c.type]?.label], ["Matter", c.matter], ["Location", c.city], ["Opened", c.opened]] as [string, string][]).map(([k, v]) => (
                <div key={k} className="row between" style={{ fontSize: 13.5, paddingBottom: 11, borderBottom: "1px solid var(--line)" }}><span style={{ color: "var(--text-3)" }}>{k}</span><strong style={{ textAlign: "right", maxWidth: 160 }}>{v}</strong></div>
              ))}
            </div>
            <div className="row" style={{ gap: 14, marginTop: 22, padding: 18, borderRadius: 12, background: c.strength >= 80 ? "var(--verified-tint)" : "var(--amber-tint)" }}>
              <ScoreRing value={c.strength} size={48} stroke={5} color={c.strength >= 80 ? "var(--verified)" : "var(--amber)"} />
              <div className="stack" style={{ gap: 2 }}><strong style={{ fontSize: 14, color: c.strength >= 80 ? "var(--verified)" : "var(--amber)" }}>{c.strength >= 80 ? "Strong case" : "Good case"}</strong><span style={{ fontSize: 12.5, color: "var(--text-2)" }}>Your details &amp; documents shape your case strength.</span></div>
            </div>
          </div>
          <div className="card" style={{ padding: 24, minHeight: 128 }}>
            <div className="row" style={{ gap: 10 }}><Icon name="lock" size={18} color="var(--pine)" /><strong style={{ fontSize: 14 }}>Private &amp; secure</strong></div>
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.55, marginTop: 9 }}>Your information is encrypted and shared only with your matched attorney. ClientSignal never sells your data.</p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
