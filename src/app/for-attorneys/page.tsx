"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MarketingNav, Pricing, FAQ, Footer } from "@/components/marketing";
import { useI18n } from "@/lib/i18n";

export default function ForAttorneys() {
  const router = useRouter();
  const { t } = useI18n();
  const go = (p: string) => router.push(p);

  const LAW_AREAS = [t.caseTypes.injury, t.caseTypes.criminal, t.caseTypes.immigration, t.caseTypes.family, t.caseTypes.employment];

  const PROBLEMS = [t.forAttorneys.problem1, t.forAttorneys.problem2, t.forAttorneys.problem3, t.forAttorneys.problem4];

  const DIFFERENTIATORS: [string, string, string][] = [
    ["shield", t.forAttorneys.vettedLeads, t.forAttorneys.vettedLeadsDesc],
    ["lock", t.forAttorneys.trustedSources, t.forAttorneys.trustedSourcesDesc],
    ["scale", t.forAttorneys.qualifiedCases, t.forAttorneys.qualifiedCasesDesc],
    ["bell", t.forAttorneys.realTimeAlerts, t.forAttorneys.realTimeAlertsDesc],
  ];

  const WORKFLOW: [string, string][] = [
    [t.forAttorneys.workflow1Title, t.forAttorneys.workflow1Desc],
    [t.forAttorneys.workflow2Title, t.forAttorneys.workflow2Desc],
    [t.forAttorneys.workflow3Title, t.forAttorneys.workflow3Desc],
    [t.forAttorneys.workflow4Title, t.forAttorneys.workflow4Desc],
  ];

  const FEATURES: [string, string, string][] = [
    ["shield", t.forAttorneys.verifiedLeads, t.forAttorneys.verifiedLeadsDesc],
    ["bell", t.forAttorneys.instantAlerts, t.forAttorneys.instantAlertsDesc],
    ["filter", t.forAttorneys.smartRouting, t.forAttorneys.smartRoutingDesc],
    ["message", t.forAttorneys.clientMessaging, t.forAttorneys.clientMessagingDesc],
    ["chart", t.forAttorneys.analyticsDashboard, t.forAttorneys.analyticsDashboardDesc],
    ["lock", t.forAttorneys.encryptedIntake, t.forAttorneys.encryptedIntakeDesc],
  ];

  const PRACTICE_TOOLS: [string, string][] = [
    [t.caseTypes.injury, t.forAttorneys.piTools],
    [t.caseTypes.family, t.forAttorneys.familyTools],
    [t.caseTypes.criminal, t.forAttorneys.criminalTools],
    [t.caseTypes.immigration, t.forAttorneys.immigrationTools],
    [t.caseTypes.employment, t.forAttorneys.employmentTools],
  ];

  return (
    <div id="m-scroll" className="thin-scroll" style={{ height: "100%", overflowY: "auto", background: "var(--paper)" }}>
      <MarketingNav audience="attorney" />

      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap" style={{ paddingTop: 70, paddingBottom: 76 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 48, alignItems: "center" }} className="hero-grid">
            <div className="stack" style={{ gap: 24 }}>
              <span className="pill" style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--text-2)", alignSelf: "flex-start" }}>
                <span className="pulse-dot" /> {t.forAttorneys.heroPill}
              </span>
              <h1 className="display" style={{ fontSize: "clamp(40px,6vw,72px)" }}>
                {t.forAttorneys.heroTitle}
              </h1>
              <p style={{ fontSize: "clamp(17px,2vw,20px)", color: "var(--text-2)", lineHeight: 1.55, maxWidth: 560 }}>
                {t.forAttorneys.heroDesc}
              </p>
              <div className="row" style={{ gap: 14, flexWrap: "wrap" }}>
                <button className="btn btn-signal btn-lg" onClick={() => go("/attorney/signup")}><Icon name="bolt" size={18} /> {t.nav.startFreeTrial}</button>
                <button className="btn btn-ghost btn-lg" onClick={() => go("/demo")}><Icon name="clock" size={18} /> {t.nav.bookADemo}</button>
              </div>
              <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
                {LAW_AREAS.map((area) => (
                  <span key={area} className="pill" style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--text-2)" }}>{area}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 26, boxShadow: "var(--sh-lg)" }}>
              <div className="row between" style={{ paddingBottom: 16, borderBottom: "1px solid var(--line)", marginBottom: 18 }}>
                <span className="eyebrow">{t.forAttorneys.leadSignal}</span>
                <span className="pill" style={{ background: "var(--verified-tint)", color: "var(--verified)" }}><Icon name="check" size={13} /> {t.forAttorneys.qualified}</span>
              </div>
              <div className="stack" style={{ gap: 16 }}>
                {[
                  [t.forAttorneys.practiceArea, t.forAttorneys.personalInjury],
                  [t.forAttorneys.contactVerified, t.forAttorneys.smsEmailConfirmed],
                  [t.forAttorneys.urgency, t.forAttorneys.urgencyDesc],
                  [t.forAttorneys.routing, t.forAttorneys.routingDesc],
                ].map(([label, value]) => (
                  <div key={label} className="row between" style={{ gap: 16, paddingBottom: 12, borderBottom: "1px solid var(--line)" }}>
                    <span style={{ color: "var(--text-3)", fontSize: 14 }}>{label}</span>
                    <strong style={{ textAlign: "right", color: "var(--ink)" }}>{value}</strong>
                  </div>
                ))}
              </div>
              <button className="btn btn-pine" style={{ width: "100%", marginTop: 22 }} onClick={() => go("/demo")}>{t.forAttorneys.viewWorkflow} <Icon name="arrowR" size={17} /></button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "82px 0" }}>
        <div className="wrap hero-grid" style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 44, alignItems: "start" }}>
          <div className="stack" style={{ gap: 14 }}>
            <span className="eyebrow">{t.forAttorneys.theProblem}</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>{t.forAttorneys.problemTitle}</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.65, fontSize: 16 }}>
              {t.forAttorneys.problemDesc}
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
            <span className="eyebrow">{t.forAttorneys.smartIntake}</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>{t.forAttorneys.aiVerifiedLeads}</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.65, fontSize: 16 }}>{t.forAttorneys.aiVerifiedDesc}</p>
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
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>{t.forAttorneys.howItWorks}</span>
              <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)", color: "#fff" }}>{t.forAttorneys.fourSteps}</h2>
            </div>
            <button className="btn btn-ghost-light" onClick={() => go("/demo")}>{t.forAttorneys.viewWorkflow} <Icon name="arrowR" size={17} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }} className="feat-grid">
            {WORKFLOW.map(([title, desc], i) => (
              <div key={i} style={{ padding: 22, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, background: "rgba(255,255,255,0.04)" }}>
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
            <span className="eyebrow">{t.forAttorneys.features}</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>{t.forAttorneys.featuresTitle}</h2>
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
            <span className="eyebrow">{t.forAttorneys.practiceAreaIntake}</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>{t.forAttorneys.practiceAreaTitle}</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.65 }}>{t.forAttorneys.practiceAreaDesc}</p>
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
            <span className="eyebrow">{t.forAttorneys.pricing}</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.4vw,48px)" }}>{t.forAttorneys.pricingTitle}</h2>
          </div>
          <Pricing />
        </div>
      </section>

      <section style={{ padding: "20px 0 86px" }}>
        <div className="wrap">
          <div className="stack" style={{ gap: 12, textAlign: "center", alignItems: "center", marginBottom: 24 }}>
            <span className="eyebrow">{t.forAttorneys.faq}</span>
            <h2 className="display" style={{ fontSize: "clamp(28px,4vw,40px)" }}>{t.forAttorneys.commonQuestions}</h2>
          </div>
          <FAQ />
        </div>
      </section>

      <section style={{ padding: "0 0 100px" }}>
        <div className="wrap">
          <div className="gridlines" style={{ background: "var(--pine)", borderRadius: 26, padding: "70px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div className="stack" style={{ gap: 22, maxWidth: 660, margin: "0 auto", position: "relative", zIndex: 1 }}>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>{t.forAttorneys.finalCTA}</span>
              <h2 className="display" style={{ fontSize: "clamp(32px,5vw,52px)", color: "#fff" }}>{t.forAttorneys.readyForLeads}</h2>
              <div className="row" style={{ gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-signal btn-lg" onClick={() => go("/attorney/signup")}>{t.nav.startFreeTrial}</button>
                <button className="btn btn-ghost-light btn-lg" onClick={() => go("/demo")}>{t.nav.bookADemo}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
