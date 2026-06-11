"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MarketingNav, Pricing, FAQ, Footer } from "@/components/marketing";

const LAW_AREAS = ["Personal Injury", "Criminal Law", "Immigration", "Family Law", "Employment Law"];

const PROBLEMS = [
  "78% of clients hire the first attorney who responds.",
  "Solos lose 30-40% of leads due to slow intake.",
  "Manual intake is chaotic, inconsistent, and expensive.",
  "Most lead-gen companies send unverified, low-quality cases.",
];

const DIFFERENTIATORS = [
  ["shield", "Vetted leads", "Every inquiry is screened for contact accuracy, intent, and case type."],
  ["lock", "Trusted sources", "No spam, no bots, no recycled leads."],
  ["scale", "Qualified cases", "Cases are scored and routed instantly to the right attorney."],
  ["bell", "Real-time alerts", "Text, email, or in-app signal so your firm can respond first."],
];

const WORKFLOW = [
  ["A client reaches out", "They submit a short intake form through your website, landing page, or ClientSignal link."],
  ["We verify and score the lead", "ClientSignal checks for accuracy, intent, practice area, urgency, and supporting documents."],
  ["You receive an instant signal", "Text, email, or in-app alert. Your firm chooses the routing channel."],
  ["You engage first and win the case", "Speed plus verification helps raise conversion quality."],
];

const FEATURES = [
  ["shield", "Verified Leads", "Every inquiry is screened for accuracy, intent, and case type."],
  ["bell", "Instant Alerts", "Get notified the moment a qualified client reaches out."],
  ["filter", "Smart Routing", "Send the right cases to the right attorney automatically."],
  ["message", "Client Messaging", "Respond quickly with built-in SMS and email tools."],
  ["chart", "Analytics Dashboard", "Track lead quality, response times, and conversion rates."],
  ["lock", "Encrypted Intake", "Sensitive intake and documents are treated as encrypted, secure data."],
];

const PRACTICE_TOOLS = [
  ["Personal Injury", "Timeline case tracker, document checklist automation, form auto-fill, severity and liability scoring."],
  ["Family Law", "Safe-contact prompts, custody and child-risk screening, financial complexity scoring, court-order uploads."],
  ["Criminal Law", "Custody status, court dates, charges, bail details, prior history, and urgent hearing flags."],
  ["Immigration", "Status, visa type, I-94, pending applications, hearing risk, deportation urgency, and document uploads."],
  ["Employment Law", "Termination, discrimination, wage, retaliation, evidence, and filing-deadline screening."],
];

export default function ForAttorneys() {
  const router = useRouter();
  const go = (p: string) => router.push(p);

  return (
    <div id="m-scroll" className="thin-scroll" style={{ height: "100%", overflowY: "auto", background: "var(--paper)" }}>
      <MarketingNav audience="attorney" />

      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ paddingTop: 70, paddingBottom: 76 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 48, alignItems: "center" }} className="hero-grid">
            <div className="stack" style={{ gap: 24 }}>
              <span className="pill" style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--text-2)", alignSelf: "flex-start" }}>
                <span className="pulse-dot" /> Updated May 31, 2026
              </span>
              <h1 className="display" style={{ fontSize: "clamp(40px,6vw,72px)" }}>
                Vetted. Trusted. Qualified leads, delivered instantly.
              </h1>
              <p style={{ fontSize: "clamp(17px,2vw,20px)", color: "var(--text-2)", lineHeight: 1.55, maxWidth: 560 }}>
                ClientSignal is the modern intake and lead-routing platform built for solos and small firms. We verify every lead, score every case, and deliver only qualified clients.
              </p>
              <div className="row" style={{ gap: 14, flexWrap: "wrap" }}>
                <button className="btn btn-signal btn-lg" onClick={() => go("/attorney/signup")}><Icon name="bolt" size={18} /> Start Free Trial</button>
                <button className="btn btn-ghost btn-lg" onClick={() => go("/demo")}><Icon name="clock" size={18} /> Book a Demo</button>
              </div>
              <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
                {LAW_AREAS.map((area) => (
                  <span key={area} className="pill" style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--text-2)" }}>{area}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 26, boxShadow: "var(--sh-lg)" }}>
              <div className="row between" style={{ paddingBottom: 16, borderBottom: "1px solid var(--line)", marginBottom: 18 }}>
                <span className="eyebrow">Lead signal</span>
                <span className="pill" style={{ background: "var(--verified-tint)", color: "var(--verified)" }}><Icon name="check" size={13} /> Qualified</span>
              </div>
              <div className="stack" style={{ gap: 16 }}>
                {[
                  ["Practice area", "Personal Injury"],
                  ["Contact verified", "SMS + email confirmed"],
                  ["Urgency", "Medical treatment, police report, active pain"],
                  ["Routing", "PI attorney in jurisdiction"],
                ].map(([label, value]) => (
                  <div key={label} className="row between" style={{ gap: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" }}>
                    <span style={{ color: "var(--text-3)", fontSize: 14 }}>{label}</span>
                    <strong style={{ textAlign: "right", color: "var(--ink)" }}>{value}</strong>
                  </div>
                ))}
              </div>
              <button className="btn btn-pine" style={{ width: "100%", marginTop: 22 }} onClick={() => go("/demo")}>View the Workflow <Icon name="arrowR" size={17} /></button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "82px 0" }}>
        <div className="wrap hero-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 44, alignItems: "start" }}>
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">The Problem</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>Clients are reaching out. Firms are not responding fast enough.</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.65, fontSize: 16 }}>
              The result is missed cases, lost revenue, and frustrated clients. ClientSignal fixes this.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="feat-grid">
            {PROBLEMS.map((problem) => (
              <div key={problem} className="card" style={{ padding: 22 }}>
                <Icon name="bell" size={20} color="var(--coral)" />
                <p style={{ marginTop: 12, color: "var(--text-1)", fontWeight: 600, lineHeight: 1.45 }}>{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "84px 0", background: "var(--card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="stack" style={{ gap: 14, maxWidth: 640, marginBottom: 36 }}>
            <span className="eyebrow">Smart Intake. Instant Alerts. Better Clients.</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>AI-verified leads for modern law firms.</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.65, fontSize: 16 }}>Connecting attorneys with clients who truly need them. More clients. Less noise. Better cases.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }} className="feat-grid">
            {DIFFERENTIATORS.map(([icon, title, desc]) => (
              <div key={title} className="card feat-card" style={{ padding: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--pine-tint)", display: "grid", placeItems: "center", marginBottom: 16 }}>
                  <Icon name={icon} size={21} color="var(--pine)" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" style={{ padding: "90px 0", background: "var(--pine)", color: "#fff", position: "relative" }} className="gridlines">
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <div className="row between" style={{ alignItems: "end", marginBottom: 42, gap: 20, flexWrap: "wrap" }}>
            <div className="stack" style={{ gap: 12, maxWidth: 560 }}>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>How It Works</span>
              <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)", color: "#fff" }}>Four steps from inquiry to engagement.</h2>
            </div>
            <button className="btn btn-ghost-light" onClick={() => go("/demo")}>View the Workflow <Icon name="arrowR" size={17} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }} className="feat-grid">
            {WORKFLOW.map(([title, desc], i) => (
              <div key={title} style={{ padding: 22, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, background: "rgba(255,255,255,0.04)" }}>
                <span className="mono" style={{ color: "var(--gold-soft)", fontSize: 24, fontWeight: 700 }}>0{i + 1}</span>
                <h3 style={{ fontSize: 18, margin: "16px 0 8px", color: "#fff" }}>{title}</h3>
                <p style={{ color: "rgba(234,240,249,0.7)", fontSize: 14, lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "86px 0" }}>
        <div className="wrap">
          <div className="stack" style={{ gap: 12, textAlign: "center", alignItems: "center", marginBottom: 38 }}>
            <span className="eyebrow">Features</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>Everything you need to capture better clients.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }} className="feat-grid">
            {FEATURES.map(([icon, title, desc]) => (
              <div key={title} className="card" style={{ padding: 24 }}>
                <Icon name={icon} size={23} color="var(--signal)" />
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "14px 0 8px" }}>{title}</h3>
                <p style={{ color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "84px 0", background: "var(--card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="stack" style={{ gap: 12, marginBottom: 34, maxWidth: 720 }}>
            <span className="eyebrow">Practice Area Intake</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>Each practice area asks the questions attorneys actually need.</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.65 }}>Personal injury gets timelines and documents. Family law gets safety screening. Criminal law gets court urgency. Immigration gets status and document checks. Employment law gets evidence and deadline prompts.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }} className="feat-grid">
            {PRACTICE_TOOLS.map(([area, detail]) => (
              <div key={area} className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{area}</h3>
                <p style={{ color: "var(--text-2)", fontSize: 13.5, lineHeight: 1.55 }}>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "86px 0" }}>
        <div className="wrap">
          <div className="stack" style={{ gap: 12, textAlign: "center", alignItems: "center", marginBottom: 34 }}>
            <span className="eyebrow">Pricing</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>Pick the package that matches your intake motion.</h2>
          </div>
          <Pricing />
        </div>
      </section>

      <section style={{ padding: "20px 0 86px" }}>
        <div className="wrap">
          <div className="stack" style={{ gap: 12, textAlign: "center", alignItems: "center", marginBottom: 24 }}>
            <span className="eyebrow">FAQ</span>
            <h2 className="display" style={{ fontSize: "clamp(28px,4vw,40px)" }}>Common questions.</h2>
          </div>
          <FAQ />
        </div>
      </section>

      <section style={{ padding: "0 0 100px" }}>
        <div className="wrap">
          <div className="gridlines" style={{ background: "var(--pine)", borderRadius: 26, padding: "70px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div className="stack" style={{ gap: 22, maxWidth: 660, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>Final CTA</span>
              <h2 className="display" style={{ fontSize: "clamp(32px,5vw,52px)", color: "#fff" }}>Ready for vetted, trusted, qualified leads?</h2>
              <div className="row" style={{ gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-signal btn-lg" onClick={() => go("/attorney/signup")}>Start Free Trial</button>
                <button className="btn btn-ghost-light btn-lg" onClick={() => go("/demo")}>Book a Demo</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
