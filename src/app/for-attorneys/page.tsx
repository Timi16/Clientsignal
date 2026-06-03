"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Mark, Logo, Verified, Avatar, ScoreRing } from "@/components/ui";
import { MarketingNav, HeroTagCloud, Step, Pricing, FAQ, Footer } from "@/components/marketing";
import { CASE_TYPES } from "@/lib/data";

export default function ForAttorneys() {
  const router = useRouter();
  const go = (p: string) => router.push(p);
  return (
    <div id="m-scroll" className="thin-scroll" style={{ height: "100%", overflowY: "auto", background: "var(--paper)" }}>
      <MarketingNav audience="attorney" />

      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, right: -150, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, var(--signal-tint) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="wrap" style={{ position: "relative", paddingTop: 70, paddingBottom: 90 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 60, alignItems: "center" }} className="hero-grid">
            <div className="stack" style={{ gap: 28 }}>
              <span className="pill rise" style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--text-2)", alignSelf: "flex-start", animationDelay: ".05s" }}>
                <span className="pulse-dot" /> Vetted. Trusted. Qualified leads.
              </span>
              <h1 className="display rise" style={{ fontSize: "clamp(40px,6vw,74px)", animationDelay: ".12s" }}>
                Smart intake.<br />Instant alerts.<br /><span style={{ fontStyle: "italic", color: "var(--pine)" }}>Better clients</span><span style={{ color: "var(--signal-deep)" }}>.</span>
              </h1>
              <p className="rise" style={{ fontSize: "clamp(17px,2vw,20px)", color: "var(--text-2)", lineHeight: 1.55, maxWidth: 490, animationDelay: ".2s" }}>
                The modern intake and lead-routing platform for solos and small firms. We verify every lead, score every case, and deliver only qualified clients — routed to you the instant they&apos;re ready.
              </p>
              <div className="row rise" style={{ gap: 14, flexWrap: "wrap", animationDelay: ".28s" }}>
                <button className="btn btn-signal btn-lg" onClick={() => go("/attorney/signup")}><Icon name="bolt" size={19} /> Get started</button>
                <button className="btn btn-ghost btn-lg" onClick={() => go("/demo")}><Icon name="clock" size={18} /> Book a demo</button>
              </div>
              <div className="row rise" style={{ gap: 24, marginTop: 10, animationDelay: ".36s", flexWrap: "wrap" }}>
                {[["~4 min", "median response"], ["48 hr", "quality guarantee"], ["100%", "verified bar #"]].map(([n, l]) => (
                  <div key={l} className="stack" style={{ gap: 2 }}>
                    <strong className="mono" style={{ fontSize: 22, color: "var(--ink)" }}>{n}</strong>
                    <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rise" style={{ animationDelay: ".24s" }}><HeroTagCloud /></div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "26px 0", background: "var(--card)" }}>
        <div className="wrap row" style={{ gap: 40, flexWrap: "wrap", justifyContent: "space-between", opacity: 0.8 }}>
          <span className="mono" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>Trusted across practice areas</span>
          <div className="row" style={{ gap: 28, flexWrap: "wrap" }}>
            {["Personal Injury", "Family", "Criminal", "Immigration", "Employment", "Business"].map(t => (
              <span key={t} style={{ fontWeight: 600, fontSize: 15, color: "var(--text-2)" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "110px 0" }}>
        <div className="wrap">
          <div className="stack" style={{ gap: 16, marginBottom: 56, maxWidth: 560 }}>
            <span className="eyebrow">How it works</span>
            <h2 className="display" style={{ fontSize: "clamp(32px,5vw,52px)" }}>Three steps between a problem and a callback.</h2>
          </div>
          <div className="row step-row" style={{ gap: 50, alignItems: "flex-start", flexWrap: "wrap" }}>
            <Step n={1} icon="pen" title="Describe it once" desc="A guided intake adapts its questions to your case type — injury, family, criminal, immigration and more — and lets you attach documents securely." accent="var(--signal-tint)" />
            <Step n={2} icon="zap" title="We score & route" desc="ClientSignal grades each inquiry on quality and urgency, then matches it to verified attorneys by practice area and jurisdiction." accent="var(--amber-tint)" />
            <Step n={3} icon="phone" title="An attorney responds" desc="The right attorney is alerted instantly by SMS and email and reaches out directly — usually within minutes, while it still matters." accent="var(--verified-tint)" />
          </div>
        </div>
      </section>

      {/* LEAD SCORING */}
      <section id="scoring" style={{ padding: "110px 0", background: "var(--pine)", color: "var(--on-pine)", position: "relative", overflow: "hidden" }}>
        <div className="gridlines" />
        <div className="wrap" style={{ position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-grid">
            <div className="stack" style={{ gap: 24 }}>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>The signal engine</span>
              <h2 className="display" style={{ fontSize: "clamp(32px,5vw,52px)" }}>Not just a lead.<br />A scored, ranked <span style={{ fontStyle: "italic", color: "var(--gold-soft)" }}>signal</span>.</h2>
              <p style={{ fontSize: 17, color: "rgba(234,240,249,0.78)", lineHeight: 1.6, maxWidth: 460 }}>
                Every inquiry is graded the instant it arrives. Attorneys see exactly where to spend their attention — no more sifting through cold, half-finished form fills.
              </p>
              <div className="stack" style={{ gap: 14, marginTop: 6 }}>
                {[
                  ["Quality score", "Completeness, consent, documents, and contactability."],
                  ["Urgency score", "Deadlines, statute clocks, and time-sensitivity."],
                  ["Est. case value", "Modeled range to prioritize the highest-impact matters."],
                ].map(([t, d]) => (
                  <div key={t} className="row" style={{ gap: 14, alignItems: "flex-start" }}>
                    <span style={{ marginTop: 3, color: "var(--gold-soft)", flex: "none" }}><Icon name="check" size={18} stroke={2.6} /></span>
                    <div><strong style={{ fontSize: 15.5 }}>{t}</strong> <span style={{ color: "rgba(234,240,249,0.66)", fontSize: 15 }}>— {d}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ background: "var(--card)", color: "var(--ink)", padding: 28, boxShadow: "var(--sh-lg)" }}>
              <span className="eyebrow">How scoring works</span>
              <div className="stack" style={{ gap: 16, marginTop: 20 }}>
                {[
                  ["shield", "Identity & consent verified", "SMS + email confirmed before routing", "var(--verified)"],
                  ["doc", "Completeness & documents", "More detail and evidence = higher score", "var(--signal)"],
                  ["clock", "Urgency & deadlines", "Time-sensitive matters surface first", "var(--amber)"],
                  ["scale", "Practice-area & jurisdiction fit", "Only matched to what you actually handle", "var(--pine)"],
                ].map(([ic, t, d, c]) => (
                  <div key={t} className="row" style={{ gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: "var(--paper-2)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={ic} size={20} color={c} /></div>
                    <div className="stack" style={{ gap: 2 }}><strong style={{ fontSize: 14.5 }}>{t}</strong><span style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.4 }}>{d}</span></div>
                  </div>
                ))}
              </div>
              <div className="row between" style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
                <span style={{ fontSize: 13.5, color: "var(--text-2)" }}>Every lead arrives pre-scored &amp; exclusive</span>
                <span className="pill" style={{ background: "var(--verified-tint)", color: "var(--verified)", fontSize: 12 }}><Verified size={13} /> Vetted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOR ATTORNEYS FEATURES */}
      <section id="attorneys" style={{ padding: "110px 0" }}>
        <div className="wrap">
          <div className="row between" style={{ alignItems: "flex-end", marginBottom: 50, flexWrap: "wrap", gap: 20 }}>
            <div className="stack" style={{ gap: 16, maxWidth: 560 }}>
              <span className="eyebrow">For attorneys</span>
              <h2 className="display" style={{ fontSize: "clamp(32px,5vw,52px)" }}>Be the first call, not the fifth.</h2>
            </div>
            <button className="btn btn-pine" onClick={() => go("/attorney/signup")}>Apply to join <Icon name="arrowR" size={17} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="feat-grid">
            {[
              ["bell", "Instant alerts", "SMS + email the moment a matching lead is scored. Respond from your phone in seconds."],
              ["shield", "Verified & exclusive", "Every attorney is bar-verified. Premium leads are sold to one attorney — never blasted to ten."],
              ["message", "Built-in messaging", "A secure two-way thread with each client, plus case notes that stay attached to the lead."],
              ["plug", "CRM integrations", "Push accepted leads straight into Clio, MyCase, or Lawmatics — no copy-paste."],
              ["chart", "Real analytics", "Win rates, response times, lead value, and ROI per practice area — all in one view."],
              ["dollar", "Pay your way", "Predictable monthly subscription or pure pay-per-lead. Switch anytime."],
            ].map(([icon, t, d]) => (
              <div key={t} className="card feat-card" style={{ padding: 26 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: "var(--pine-tint)", display: "grid", placeItems: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={22} color="var(--pine)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{t}</h3>
                <p style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL IMAGE BAND */}
      <section style={{ padding: "0 0 30px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", borderRadius: 26, overflow: "hidden", boxShadow: "var(--sh-lg)" }} className="hero-grid">
            <div style={{ position: "relative", minHeight: 420, background: "#0B1F3A" }}>
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1100&h=900&fit=crop" alt="Attorneys in consultation" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(11,31,58,0.55), rgba(11,31,58,0.1))" }} />
            </div>
            <div className="gridlines" style={{ background: "var(--pine)", color: "#fff", padding: "54px 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
              <span style={{ fontSize: 56, fontFamily: "var(--serif)", color: "var(--gold-soft)", lineHeight: 0.5, height: 30, position: "relative", zIndex: 1 }}>&ldquo;</span>
              <p className="display" style={{ fontSize: "clamp(22px,2.4vw,29px)", lineHeight: 1.32, marginBottom: 26, position: "relative", zIndex: 1 }}>
                In our first month we signed three personal-injury cases worth more than a year of our old ad spend. The leads actually pick up the phone.
              </p>
              <div className="row" style={{ gap: 13, position: "relative", zIndex: 1 }}>
                <Avatar name="David Park" size={48} />
                <div className="stack" style={{ gap: 2 }}>
                  <div className="row" style={{ gap: 6 }}><strong style={{ fontSize: 15 }}>David Park</strong><Verified size={15} /></div>
                  <span style={{ fontSize: 13, color: "rgba(234,240,249,0.65)" }}>Park Immigration Law · San Jose</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pricing />
      <FAQ />

      {/* CTA BAND */}
      <section style={{ padding: "30px 0 100px" }}>
        <div className="wrap">
          <div className="gridlines" style={{ background: "var(--pine)", borderRadius: 26, padding: "72px 56px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "50%", right: -80, transform: "translateY(-50%)", opacity: 0.5 }}>
              <svg width="420" height="420" viewBox="0 0 420 420" fill="none">
                <g transform="rotate(-45 210 210)" stroke="#D4A017" fill="none" strokeLinecap="round">
                  {[60, 110, 160, 210].map((r, i) => <path key={i} d={`M210 ${210 + r} a${r} ${r} 0 0 0 0 ${-2 * r}`} strokeWidth="3" opacity={0.5 - i * 0.1} />)}
                </g>
                <circle cx="110" cy="210" r="9" fill="#3B82F6" />
              </svg>
            </div>
            <div className="stack" style={{ gap: 24, position: "relative", maxWidth: 600, zIndex: 1 }}>
              <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>Get started</span>
              <h2 className="display" style={{ fontSize: "clamp(34px,5vw,56px)", color: "#fff" }}>Send your <span style={{ fontStyle: "italic", color: "var(--gold-soft)" }}>signal</span>.</h2>
              <p style={{ fontSize: 18, color: "rgba(234,240,249,0.75)", maxWidth: 460, lineHeight: 1.5 }}>
                Whether you need legal help or you&apos;re ready to respond to leads — get matched in minutes.
              </p>
              <div className="row" style={{ gap: 14, flexWrap: "wrap" }}>
                <button className="btn btn-gold btn-lg" onClick={() => go("/attorney/signup")}>Get started</button>
                <button className="btn btn-ghost-light btn-lg" onClick={() => go("/demo")}>Book a demo</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
