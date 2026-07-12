"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Logo, Mark, ScoreRing, Verified, Avatar, CaseTag, LField, inpStyle } from "@/components/ui";
import { CASE_TYPES, INTAKE_CONFIG } from "@/lib/data";

type UploadedDoc = { name: string; size: string };
type IntakeData = {
  type: string;
  sub: string;
  desc: string;
  city: string;
  state: string;
  name: string;
  email: string;
  phone: string;
  when: string;
  urgent: string;
  consent: boolean;
  docs: UploadedDoc[];
};

const PRACTICE_PROMPTS: Record<string, { signals: string[]; docs: string[]; scoring: string[] }> = {
  injury: {
    signals: ["Date, time, and location of incident", "Injury and medical treatment details", "Police report, witnesses, photos, and liability indicators", "Insurance and claim information"],
    docs: ["Photos of injuries", "Photos of vehicles or property", "Police report", "Medical records", "Insurance letters"],
    scoring: ["Severity score", "Liability score", "Insurance coverage score", "Urgency score", "Case value potential"],
  },
  family: {
    signals: ["Safe contact confirmation", "Case type, household, children, and custody details", "Domestic violence or protective-order screening", "Property, debt, income, court dates, and existing orders"],
    docs: ["Court orders", "CPS documents", "Police reports", "Marriage certificate", "Financial statements", "Message screenshots"],
    scoring: ["Urgency score", "Safety risk score", "Child involvement score", "Financial complexity score", "Case type score"],
  },
  criminal: {
    signals: ["Charges, arrest date, location, and custody status", "Court date, court location, judge, and bail amount", "Prior arrests, convictions, probation, or parole", "Witnesses, video evidence, and injury flags"],
    docs: ["Arrest report", "Court documents", "Bail paperwork", "Police reports", "Photos, videos, or screenshots"],
    scoring: ["Custody urgency score", "Court deadline score", "Charge severity score", "Prior history score", "Representation conflict score"],
  },
  immigration: {
    signals: ["Current status and visa type", "Entry method, inspection, I-94, and expiration", "Pending USCIS applications and receipt numbers", "Detention, deportation, criminal history, family status, and hearing risk"],
    docs: ["Passport", "Visa", "I-94", "USCIS notices", "Court documents", "Work authorization", "Marriage or birth certificates"],
    scoring: ["Status urgency score", "Removal risk score", "Document completeness score", "Family eligibility score", "Criminal-history impact score"],
  },
  employment: {
    signals: ["Termination, discrimination, harassment, wage, or retaliation details", "Employer, dates, witnesses, and HR complaint status", "Pay, overtime, severance, or policy evidence", "Filing deadlines and active agency complaints"],
    docs: ["Termination letter", "Employment agreement", "Pay stubs", "HR emails", "Messages", "Policy documents"],
    scoring: ["Deadline urgency score", "Evidence score", "Damages score", "Retaliation indicator score", "Employer size score"],
  },
};

function IntakeDone({ data, score, urgency }: { data: IntakeData; score: number; urgency: number }) {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const leadId = 4472 + ((score + urgency + data.desc.length) % 9);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1400);
    const t2 = setTimeout(() => setPhase(2), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase < 2) {
    return (
      <div style={{ height: "100vh", display: "grid", placeItems: "center", background: "var(--pine)", color: "var(--on-pine)", textAlign: "center" }}>
        <div className="stack" style={{ alignItems: "center", gap: 26 }}>
          <Mark size={80} live />
          <div className="stack" style={{ gap: 8 }}>
            <h1 className="display" style={{ fontSize: 32, color: "var(--on-pine)" }}>{phase === 0 ? "Scoring your inquiry…" : "Finding your attorney…"}</h1>
            <p className="mono" style={{ fontSize: 13, color: "var(--gold-soft)", letterSpacing: "0.1em" }}>{phase === 0 ? "ANALYZING QUALITY · URGENCY · VALUE" : "MATCHING BY PRACTICE AREA · JURISDICTION"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="thin-scroll" style={{ height: "100vh", overflowY: "auto", background: "var(--paper)" }}>
      <div className="row" style={{ padding: "20px 28px", borderBottom: "1px solid var(--line)" }}><Link href="/" aria-label="Go to home"><Logo size={26} /></Link></div>
      <div className="wrap" style={{ maxWidth: 620, paddingTop: 50, paddingBottom: 70 }}>
        <div className="rise stack" style={{ alignItems: "center", textAlign: "center", gap: 18, marginBottom: 36 }}>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--verified-tint)", display: "grid", placeItems: "center" }}>
            <Icon name="check" size={38} color="var(--verified)" stroke={2.5} />
          </div>
          <h1 className="display" style={{ fontSize: "clamp(32px,5vw,46px)" }}>You&apos;re matched.</h1>
          <p style={{ color: "var(--text-2)", fontSize: 16.5, lineHeight: 1.5, maxWidth: 440 }}>
            Your inquiry has been scored and routed to a verified attorney who handles {CASE_TYPES[data.type]?.label.toLowerCase()} in {data.city || "your area"}. Expect a response shortly.
          </p>
        </div>

        <div className="card rise" style={{ padding: 26, marginBottom: 20, animationDelay: ".1s" }}>
          <div className="row between" style={{ marginBottom: 20 }}>
            <span className="eyebrow">Your inquiry · scored</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>LD-{leadId}</span>
          </div>
          <div className="row" style={{ gap: 26, justifyContent: "center", marginBottom: 22 }}>
            <div className="stack" style={{ alignItems: "center", gap: 7 }}><ScoreRing value={score} size={84} stroke={7} /><span style={{ fontSize: 12.5, color: "var(--text-2)" }}>Quality</span></div>
            <div className="stack" style={{ alignItems: "center", gap: 7 }}><ScoreRing value={urgency} size={84} stroke={7} color={urgency > 80 ? "var(--coral)" : "var(--amber)"} /><span style={{ fontSize: 12.5, color: "var(--text-2)" }}>Urgency</span></div>
          </div>
          <div className="stack" style={{ gap: 11 }}>
            {([["Case type", CASE_TYPES[data.type]?.label], ["Matter", data.sub], ["Location", `${data.city || "—"}${data.state ? ", " + data.state : ""}`], ["Documents", `${data.docs?.length || 0} attached`]] as [string, string][]).map(([k, v]) => (
              <div key={k} className="row between" style={{ fontSize: 14.5, paddingBottom: 10, borderBottom: "1px solid var(--line)" }}>
                <span style={{ color: "var(--text-3)" }}>{k}</span><strong>{v}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card rise" style={{ padding: 22, marginBottom: 28, animationDelay: ".2s", background: "var(--pine)", color: "var(--on-pine)" }}>
          <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>Matched attorney</span>
          <div className="row" style={{ gap: 14, marginTop: 14 }}>
            <Avatar name="Sarah Mitchell" size={54} color="var(--gold-deep)" />
            <div className="stack" style={{ gap: 4 }}>
              <div className="row" style={{ gap: 7 }}><strong style={{ fontSize: 17 }}>Sarah Mitchell</strong><Verified size={16} /></div>
              <span style={{ fontSize: 13.5, color: "rgba(234,240,249,0.7)" }}>Mitchell &amp; Cole LLP · 12 yrs · {CASE_TYPES[data.type]?.label}</span>
            </div>
            <div className="stack" style={{ marginLeft: "auto", textAlign: "right" }}>
              <span className="mono" style={{ fontSize: 18, color: "var(--gold-soft)" }}>~4 min</span>
              <span style={{ fontSize: 11.5, color: "rgba(234,240,249,0.6)" }}>median response</span>
            </div>
          </div>
        </div>

        <div className="stack" style={{ gap: 12 }}>
          <button className="btn btn-signal btn-lg" onClick={() => router.push("/client/dashboard")}><Icon name="grid" size={17} /> Go to my case dashboard</button>
          <button className="btn btn-ghost" onClick={() => router.push("/client/cases")}>Back to my cases</button>
        </div>
        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-3)" }}>Your case is now in your dashboard — track status, upload documents and message your attorney anytime.</p>
      </div>
    </div>
  );
}

export default function IntakeForm({ inDashboard = false }: { inDashboard?: boolean }) {
  const router = useRouter();
  const exitTo = inDashboard ? "/client/cases" : "/";
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>({ type: "", sub: "", desc: "", city: "", state: "", name: "", email: "", phone: "", when: "", urgent: "", consent: false, docs: [] });
  const set = <K extends keyof IntakeData>(k: K, v: IntakeData[K]) => setData(d => ({ ...d, [k]: v }));
  const cfg = INTAKE_CONFIG[data.type];
  const prompts = PRACTICE_PROMPTS[data.type];
  const steps = ["Case type", "Details", "Your story", "Documents", "Contact"];

  const canNext = () => {
    if (step === 0) return !!data.type;
    if (step === 1) return !!data.sub;
    if (step === 2) return data.desc.trim().length >= 20 && data.city.trim();
    if (step === 4) return data.name && data.email && data.phone && data.consent;
    return true;
  };

  const missing = () => {
    if (step === 0) return "Pick a category to continue";
    if (step === 1) return "Select an option to continue";
    if (step === 2) {
      const need: string[] = [];
      if (data.desc.trim().length < 20) need.push("a short description");
      if (!data.city.trim()) need.push("your city");
      return need.length ? "Add " + need.join(" & ") : "";
    }
    if (step === 4) {
      const need: string[] = [];
      if (!data.name) need.push("name");
      if (!data.email) need.push("email");
      if (!data.phone) need.push("phone");
      if (!data.consent) need.push("consent");
      return need.length ? "Add " + need.join(", ") : "";
    }
    return "";
  };

  const score = Math.min(98, 55 + (data.desc.length > 80 ? 18 : 8) + (data.docs?.length || 0) * 5 + (data.urgent ? 10 : 0) + (data.consent ? 6 : 0));
  const urgency = data.urgent === "yes" ? 88 : 60;

  if (step === 5) return <IntakeDone data={data} score={score} urgency={urgency} />;

  return (
    <div className="thin-scroll" style={{ height: "100vh", overflowY: "auto", background: "var(--paper)" }}>
      {/* top bar */}
      <div className="row between" style={{ padding: "20px 28px", borderBottom: "1px solid var(--line)", background: "rgba(234,240,249,0.9)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/" aria-label="Go to home"><Logo size={26} /></Link>
        {inDashboard && <span className="pill" style={{ background: "var(--blue-tint)", color: "var(--signal)" }}><Icon name="plus" size={13} /> New case</span>}
        <button className="btn btn-ghost btn-sm" onClick={() => router.push(exitTo)}><Icon name="x" size={16} /> Exit</button>
      </div>

      {/* progress */}
      <div className="wrap" style={{ maxWidth: 720, paddingTop: 34 }}>
        <div className="row between" style={{ marginBottom: 8 }}>
          <span className="eyebrow">Step {step + 1} of 5</span>
          <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{steps[step]}</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--paper-2)", overflow: "hidden", marginBottom: 36 }}>
          <div style={{ height: "100%", width: `${((step + 1) / 5) * 100}%`, background: "var(--signal-deep)", borderRadius: 999, transition: "width .5s var(--ease)" }} />
        </div>

        {/* STEP 0 — case type */}
        {step === 0 && (
          <div className="rise">
            <h1 className="display" style={{ fontSize: "clamp(30px,4.5vw,42px)", marginBottom: 10 }}>What kind of legal help do you need?</h1>
            <p style={{ color: "var(--text-2)", fontSize: 16, marginBottom: 30 }}>Pick the closest match — we&apos;ll tailor the next questions.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="ck-grid">
              {Object.entries(CASE_TYPES).map(([k, t]) => (
                <button key={k} onClick={() => { set("type", k); set("sub", ""); }} className="card" style={{
                  padding: 20, textAlign: "left", display: "flex", alignItems: "center", gap: 15,
                  border: "1.5px solid " + (data.type === k ? "var(--pine)" : "var(--line)"),
                  background: data.type === k ? "var(--pine-tint)" : "var(--card)", transition: "all .2s", cursor: "pointer",
                }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: t.tint, display: "grid", placeItems: "center", flex: "none" }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", background: t.color }} />
                  </span>
                  <div>
                    <strong style={{ fontSize: 16 }}>{t.label}</strong>
                    <div style={{ fontSize: 13, color: "var(--text-3)" }}>{k === "injury" ? "Accidents, malpractice" : k === "family" ? "Divorce, custody, support" : k === "criminal" ? "Charges & defense" : k === "immigration" ? "Visas, residency, status" : k === "employment" ? "Workplace disputes" : "Contracts, formation"}</div>
                  </div>
                  {data.type === k && <span style={{ marginLeft: "auto", color: "var(--pine)" }}><Icon name="check" size={20} stroke={2.5} /></span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — dynamic detail */}
        {step === 1 && cfg && (
          <div className="rise">
            <CaseTag type={data.type} />
            <h1 className="display" style={{ fontSize: "clamp(28px,4.2vw,40px)", margin: "14px 0 24px" }}>{cfg.q}</h1>
            <div className="stack" style={{ gap: 11 }}>
              {cfg.opts.map(o => (
                <button key={o} onClick={() => set("sub", o)} className="row between card" style={{
                  padding: "16px 18px", textAlign: "left", cursor: "pointer",
                  border: "1.5px solid " + (data.sub === o ? "var(--pine)" : "var(--line)"),
                  background: data.sub === o ? "var(--pine-tint)" : "var(--card)", transition: "all .15s",
                }}>
                  <span style={{ fontSize: 15.5, fontWeight: 500 }}>{o}</span>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid " + (data.sub === o ? "var(--pine)" : "var(--line-2)"), display: "grid", placeItems: "center" }}>
                    {data.sub === o && <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--pine)" }} />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — story + urgency */}
        {step === 2 && cfg && (
          <div className="rise stack" style={{ gap: 24 }}>
            <div>
              <h1 className="display" style={{ fontSize: "clamp(28px,4.2vw,40px)", marginBottom: 10 }}>Tell us what happened.</h1>
              <p style={{ color: "var(--text-2)", fontSize: 15.5 }}>In your own words — the more context, the better we can match you.</p>
            </div>
            <textarea value={data.desc} onChange={e => set("desc", e.target.value)} placeholder="Describe your situation, dates, and what you're hoping to achieve…"
              style={{ width: "100%", minHeight: 150, padding: 16, borderRadius: 14, border: "1.5px solid var(--line-2)", background: "var(--card)", fontSize: 15.5, lineHeight: 1.6, resize: "vertical", outline: "none", fontFamily: "var(--sans)" }} />
            <div className="row between" style={{ marginTop: -14 }}>
              <span style={{ fontSize: 12.5, color: data.desc.length > 20 ? "var(--verified)" : "var(--text-3)" }}>{data.desc.length > 20 ? "✓ Looks good" : "At least a sentence or two"}</span>
              <span className="mono" style={{ fontSize: 12, color: "var(--text-3)" }}>{data.desc.length} chars</span>
            </div>
            <div className="row" style={{ gap: 12 }}>
              <div style={{ flex: 2 }}><LField label="City"><input value={data.city} onChange={e => set("city", e.target.value)} placeholder="Austin" style={inpStyle} /></LField></div>
              <div style={{ flex: 1 }}><LField label="State"><input value={data.state} onChange={e => set("state", e.target.value)} placeholder="TX" style={inpStyle} /></LField></div>
            </div>
            <LField label={cfg.urgent}>
              <div className="row" style={{ gap: 10 }}>
                {["Yes", "No", "Not sure"].map(o => (
                  <button key={o} onClick={() => set("urgent", o === "Yes" ? "yes" : o)} style={{
                    flex: 1, padding: "12px", borderRadius: 11, fontSize: 14, fontWeight: 600,
                    border: "1.5px solid " + ((data.urgent === "yes" && o === "Yes") || data.urgent === o ? "var(--pine)" : "var(--line-2)"),
                    background: (data.urgent === "yes" && o === "Yes") || data.urgent === o ? "var(--pine)" : "var(--card)",
                    color: (data.urgent === "yes" && o === "Yes") || data.urgent === o ? "var(--on-pine)" : "var(--text-1)", transition: "all .2s",
                  }}>{o}</button>
                ))}
              </div>
            </LField>
            {prompts && (
              <div className="card" style={{ padding: 18, background: "var(--card)" }}>
                <strong style={{ display: "block", fontSize: 14.5, marginBottom: 12 }}>This intake also checks</strong>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="dash-grid">
                  {prompts.signals.map((item) => (
                    <div key={item} className="row" style={{ gap: 9, alignItems: "flex-start", fontSize: 13.5, color: "var(--text-2)" }}>
                      <Icon name="check" size={15} color="var(--verified)" stroke={2.5} style={{ marginTop: 2, flex: "none" }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — documents */}
        {step === 3 && (
          <div className="rise stack" style={{ gap: 22 }}>
            <div>
              <h1 className="display" style={{ fontSize: "clamp(28px,4.2vw,40px)", marginBottom: 10 }}>Add supporting documents.</h1>
              <p style={{ color: "var(--text-2)", fontSize: 15.5 }}>Optional — but documents raise your match quality and help attorneys respond faster.</p>
            </div>
            <button onClick={() => {
              const names = prompts?.docs?.length ? prompts.docs : ["Police report", "ER intake", "Photos", "Contract", "Notice"];
              const label = names[(data.docs?.length || 0) % names.length].replaceAll(" ", "_").replaceAll("/", "_");
              set("docs", [...(data.docs || []), { name: `${label}.pdf`, size: (Math.random() * 3 + 0.4).toFixed(1) + " MB" }]);
            }}
              style={{ border: "2px dashed var(--line-2)", borderRadius: 16, padding: "36px 20px", background: "var(--card)", cursor: "pointer", transition: "border-color .2s" }}>
              <div className="stack" style={{ alignItems: "center", gap: 10 }}>
                <span style={{ color: "var(--pine)" }}><Icon name="upload" size={30} /></span>
                <strong style={{ fontSize: 16 }}>Click to upload</strong>
                <span style={{ fontSize: 13.5, color: "var(--text-3)" }}>PDF, JPG, PNG or ZIP · encrypted at rest</span>
              </div>
            </button>
            {prompts && (
              <div className="card" style={{ padding: 18 }}>
                <strong style={{ display: "block", fontSize: 14.5, marginBottom: 12 }}>Recommended uploads for {CASE_TYPES[data.type]?.label}</strong>
                <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                  {prompts.docs.map((doc) => (
                    <span key={doc} className="pill" style={{ background: "var(--paper-2)", color: "var(--text-2)" }}>{doc}</span>
                  ))}
                </div>
              </div>
            )}
            {data.docs?.length > 0 && (
              <div className="stack" style={{ gap: 10 }}>
                {data.docs.map((d, i) => (
                  <div key={i} className="row between card" style={{ padding: "13px 16px" }}>
                    <div className="row" style={{ gap: 12 }}>
                      <span style={{ color: "var(--pine)" }}><Icon name="doc" size={20} /></span>
                      <div className="stack"><strong style={{ fontSize: 14 }}>{d.name}</strong><span className="mono" style={{ fontSize: 11.5, color: "var(--text-3)" }}>{d.size} · uploaded</span></div>
                    </div>
                    <button onClick={() => set("docs", data.docs.filter((_d, j) => j !== i))} style={{ color: "var(--text-3)" }}><Icon name="x" size={18} /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="row" style={{ gap: 10, padding: 14, borderRadius: 12, background: "var(--blue-tint)" }}>
              <span style={{ color: "var(--signal)", flex: "none" }}><Icon name="lock" size={18} /></span>
              <span style={{ fontSize: 13.5, color: "var(--text-2)" }}>Your documents and intake data are encrypted and only shared with the verified attorney matched to your matter. This security posture is a core ClientSignal feature.</span>
            </div>
            {prompts && (
              <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                {prompts.scoring.map((scoreField) => (
                  <span key={scoreField} className="pill" style={{ background: "var(--verified-tint)", color: "var(--verified)" }}>{scoreField}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — contact + consent */}
        {step === 4 && (
          <div className="rise stack" style={{ gap: 20 }}>
            <div>
              <h1 className="display" style={{ fontSize: "clamp(28px,4.2vw,40px)", marginBottom: 10 }}>How should an attorney reach you?</h1>
              <p style={{ color: "var(--text-2)", fontSize: 15.5 }}>We share this only with your matched, verified attorney.</p>
            </div>
            <LField label="Full name"><input value={data.name} onChange={e => set("name", e.target.value)} placeholder="Jane Doe" style={inpStyle} /></LField>
            <div className="row" style={{ gap: 12 }}>
              <div style={{ flex: 1 }}><LField label="Email"><input value={data.email} onChange={e => set("email", e.target.value)} placeholder="jane@email.com" style={inpStyle} /></LField></div>
              <div style={{ flex: 1 }}><LField label="Phone"><input value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" style={inpStyle} /></LField></div>
            </div>
            <label className="row" style={{ gap: 12, alignItems: "flex-start", padding: 16, borderRadius: 14, border: "1.5px solid " + (data.consent ? "var(--pine)" : "var(--line-2)"), background: data.consent ? "var(--pine-tint)" : "var(--card)", cursor: "pointer", transition: "all .2s" }}>
              <input type="checkbox" checked={data.consent} onChange={e => set("consent", e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, accentColor: "var(--pine)" }} />
              <span style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.5 }}>I consent to ClientSignal sharing my inquiry with a verified attorney who may contact me about my matter. I understand ClientSignal is not a law firm and does not provide legal advice.</span>
            </label>
          </div>
        )}

        {/* nav buttons */}
        <div className="row between" style={{ margin: "40px 0 24px", flexWrap: "wrap", gap: 14 }}>
          <button className="btn btn-ghost" onClick={() => step === 0 ? router.push(exitTo) : setStep(step - 1)}>
            <Icon name="chevR" size={16} style={{ transform: "rotate(180deg)" }} /> Back
          </button>
          <div className="row" style={{ gap: 14 }}>
            {!canNext() && missing() && (
              <span className="row" style={{ gap: 7, fontSize: 13, color: "var(--amber)", fontWeight: 600 }}>
                <Icon name="bell" size={15} /> {missing()}
              </span>
            )}
            <button className="btn btn-signal btn-lg" disabled={!canNext()} style={{ opacity: canNext() ? 1 : 0.45, cursor: canNext() ? "pointer" : "not-allowed" }}
              onClick={() => canNext() && setStep(step + 1)}>
              {step === 4 ? "Submit inquiry" : "Continue"} <Icon name="arrowR" size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
