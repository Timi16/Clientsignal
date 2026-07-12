"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MarketingNav, Pricing, Footer } from "@/components/marketing";
import { useI18n } from "@/lib/i18n";

export default function PricingPage() {
  const router = useRouter();
  const { t } = useI18n();
  const go = (p: string) => router.push(p);
  return (
    <div id="m-scroll" className="thin-scroll" style={{ height: "100%", overflowY: "auto", background: "var(--paper)" }}>
      <MarketingNav />
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div className="gridlines" style={{ position: "absolute", inset: 0, background: "var(--pine)", height: 420 }} />
        <div className="wrap" style={{ position: "relative", paddingTop: 64, paddingBottom: 40 }}>
          <div className="stack" style={{ alignItems: "center", textAlign: "center", gap: 18, color: "#fff" }}>
            <span className="pill rise" style={{ background: "rgba(255,255,255,0.1)", color: "var(--gold-soft)", border: "1px solid rgba(212,160,23,0.4)" }}><Icon name="briefcase" size={14} /> {t.pricing.forLawFirms}</span>
            <h1 className="display rise" style={{ fontSize: "clamp(38px,5.5vw,62px)", maxWidth: 760, animationDelay: ".08s" }}>{t.pricing.heroTitle}</h1>
            <p className="rise" style={{ fontSize: 18, color: "rgba(234,240,249,0.78)", maxWidth: 540, lineHeight: 1.55, animationDelay: ".16s" }}>
              {t.pricing.heroDesc}
            </p>
            <div className="row rise" style={{ gap: 30, marginTop: 18, flexWrap: "wrap", justifyContent: "center", animationDelay: ".24s" }}>
              {[["~4 min", t.pricing.medianResponse], ["98%", t.pricing.leadAcceptance], ["3.4×", t.pricing.roiOnLeadSpend], ["48 hr", t.pricing.qualityGuarantee]].map(([n, l]) => (
                <div key={l} className="stack" style={{ gap: 2 }}>
                  <strong className="mono" style={{ fontSize: 26, color: "var(--gold-soft)" }}>{n}</strong>
                  <span style={{ fontSize: 13, color: "rgba(234,240,249,0.65)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ marginTop: -20 }}><Pricing /></div>

      {/* Comparison */}
      <section style={{ padding: "20px 0 100px" }}>
        <div className="wrap" style={{ maxWidth: 860 }}>
          <h2 className="display" style={{ fontSize: "clamp(28px,4vw,40px)", textAlign: "center", marginBottom: 36 }}>{t.pricing.whichPackage}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="dash-grid">
            {[
              { title: t.pricing.entryAndGrowth, d: t.pricing.entryAndGrowthDesc, best: t.pricing.entryAndGrowthBest, points: [t.pricingTiers.basicIntake, t.pricingTiers.clientMessaging, t.pricingTiers.basicAnalytics, t.pricingTiers.eSignature], icon: "card" },
              { title: t.pricing.premiumAndOptional, d: t.pricing.premiumAndOptionalDesc, best: t.pricing.premiumAndOptionalBest, points: [t.pricingTiers.aiDocSummarization, t.pricingTiers.teamManagement, t.pricingTiers.apiAccess, t.pricing.practiceAreaLeads], icon: "dollar" },
            ].map(o => (
              <div key={o.title} className="card" style={{ padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--blue-tint)", display: "grid", placeItems: "center", marginBottom: 16 }}><Icon name={o.icon} size={23} color="var(--signal)" /></div>
                <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 4 }}>{o.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 14 }}>{o.d}</p>
                <p style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.55, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid var(--line)" }}><strong style={{ color: "var(--text-1)" }}>{t.pricing.bestFor}</strong> {o.best}</p>
                <div className="stack" style={{ gap: 11 }}>
                  {o.points.map(p => <div key={p} className="row" style={{ gap: 10, fontSize: 14.5 }}><Icon name="check" size={16} color="var(--verified)" stroke={2.5} /> {p}</div>)}
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{ justifyContent: "center", gap: 14, marginTop: 38 }}>
            <button className="btn btn-signal btn-lg" onClick={() => go("/attorney/signup")}>{t.nav.startFreeTrial} <Icon name="arrowR" size={17} /></button>
            <button className="btn btn-ghost btn-lg" onClick={() => go("/demo")}>{t.nav.bookADemo}</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
