"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { Verified, Avatar, Photo } from "@/components/ui";
import { TESTIMONIALS } from "@/lib/data";
import { MarketingNav, Footer } from "@/components/marketing";
import { useI18n } from "@/lib/i18n";


/* ===== Page ===== */
export default function HomePage() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div id="m-scroll" style={{ height: "100vh", overflow: "auto" }}>
      <MarketingNav audience="home" />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
        <div style={{ position: "absolute", top: -240, right: -160, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, var(--signal-tint) 0%, transparent 62%)", pointerEvents: "none" }} />
        <div className="wrap" style={{ position: "relative", paddingTop: 64, paddingBottom: 70 }}>
          <div className="hero-grid" style={{ maxWidth: 640 }}>
            <div className="stack" style={{ gap: 24 }}>
              <span className="pill rise" style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--text-2)", alignSelf: "flex-start" }}>
                <span className="pulse-dot" /> {t.home.heroPill}
              </span>
              <h1 className="display rise" style={{ fontSize: "clamp(40px,5.6vw,72px)", animationDelay: ".08s" }}>
                {t.home.heroTitle}<span style={{ color: "var(--signal-deep)" }}>.</span>
              </h1>
              <p className="rise" style={{ fontSize: "clamp(17px,2vw,20px)", color: "var(--text-2)", lineHeight: 1.55, maxWidth: 480, animationDelay: ".16s" }}>
                {t.home.heroDesc}
              </p>
              <div className="row rise" style={{ gap: 13, flexWrap: "wrap", animationDelay: ".24s" }}>
                <button className="btn btn-ink btn-lg" onClick={() => router.push("/attorney/signup")}>{t.nav.startFreeTrial} <Icon name="arrowR" size={18} /></button>
                <button className="btn btn-ghost btn-lg" onClick={() => router.push("/demo")}><Icon name="clock" size={17} /> {t.nav.bookADemo}</button>
              </div>
              <div className="row rise" style={{ gap: 12, marginTop: 4, animationDelay: ".3s", alignItems: "center" }}>
                <div className="row" style={{ marginLeft: 4 }}>
                  {["Sarah Mitchell", "David Park", "Elena Reyes", "Carlos Ruiz"].map((n, i) => (
                    <div key={n} style={{ marginLeft: i ? -10 : 0, border: "2px solid var(--paper)", borderRadius: "50%" }}><Avatar name={n} size={32} /></div>
                  ))}
                </div>
                <div className="stack" style={{ gap: 1 }}>
                  <div className="row" style={{ gap: 3, color: "var(--gold-deep)" }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ fontSize: 12 }}>{s}</span>)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section style={{ borderBottom: "1px solid var(--line)", padding: "22px 0", background: "var(--card)" }}>
        <div className="wrap stack" style={{ gap: 16 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", textAlign: "center" }}>{t.home.socialProof}</span>
          <div className="row" style={{ gap: 18, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            {[["shield", t.home.stateBarVerified], ["lock", t.home.soc2], ["check", t.home.abaAligned], ["lock", t.home.encryption], ["scale", t.home.privilegeSafe]].map(([ic, txt]) => (
              <span key={txt} className="row" style={{ gap: 8, padding: "8px 16px", borderRadius: 999, background: "var(--paper)", border: "1px solid var(--line)", fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}><Icon name={ic} size={15} color="var(--pine)" /> {txt}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section style={{ padding: "70px 0 90px" }}>
        <div className="wrap">
          <div className="stack" style={{ alignItems: "center", textAlign: "center", gap: 12, marginBottom: 40 }}>
            <span className="eyebrow">{t.home.chooseYourPath}</span>
            <h2 className="display" style={{ fontSize: "clamp(28px,4vw,42px)" }}>{t.home.twoSides}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="hero-grid">
            {[
              { who: t.nav.forClients, title: t.home.forClientsTitle, d: t.home.forClientsDesc, icon: "scale", cta: t.home.findLegalHelp, dest: "/for-clients", bg: "var(--blue-tint)", c: "var(--signal)" },
              { who: t.nav.forAttorneys, title: t.home.forAttorneysTitle, d: t.home.forAttorneysDesc, icon: "briefcase", cta: t.nav.startFreeTrial, dest: "/for-attorneys", bg: "var(--gold-tint)", c: "var(--gold-deep)" },
            ].map(p => (
              <div key={p.dest} className="card feat-card" style={{ padding: 34, cursor: "pointer" }} onClick={() => router.push(p.dest)}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: p.bg, display: "grid", placeItems: "center", marginBottom: 20 }}><Icon name={p.icon} size={26} color={p.c} /></div>
                <span className="eyebrow" style={{ display: "block", marginBottom: 10 }}>{p.who}</span>
                <h3 className="display" style={{ fontSize: 26, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 22 }}>{p.d}</p>
                <span className="row gap-1" style={{ color: p.c, fontWeight: 700, fontSize: 15 }}>{p.cta} <Icon name="arrowR" size={17} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works (dark) */}
      <section style={{
        padding: "88px 0", background: "var(--pine-deep)", position: "relative", overflow: "hidden",
      }} className="gridlines">
        <div className="wrap stack" style={{ gap: 56, position: "relative", zIndex: 1 }}>
          <div className="stack" style={{ textAlign: "center", gap: 14, alignItems: "center" }}>
            <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>{t.home.howItWorks}</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.5vw,48px)", color: "#fff" }}>{t.home.trustBuilt}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }} className="feat-grid">
            {[
              { icon: "user", title: t.home.step1Title, desc: t.home.step1Desc },
              { icon: "pen", title: t.home.step2Title, desc: t.home.step2Desc },
              { icon: "shield", title: t.home.step3Title, desc: t.home.step3Desc },
              { icon: "message", title: t.home.step4Title, desc: t.home.step4Desc },
            ].map((s, i) => (
              <div key={i} className="stack rise" style={{ gap: 14, animationDelay: `${(i + 1) * 0.1}s` }}>
                <div className="row between">
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "rgba(255,255,255,0.08)",
                    display: "grid", placeItems: "center",
                  }}>
                    <Icon name={s.icon} size={22} color="var(--gold-soft)" />
                  </div>
                  <span className="display" style={{ fontSize: 36, color: "rgba(255,255,255,0.15)" }}>0{i + 1}</span>
                </div>
                <strong style={{ fontSize: 17, color: "#fff" }}>{s.title}</strong>
                <p style={{ fontSize: 14, color: "rgba(234,240,249,0.66)", lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "30px 0 90px" }}>
        <div className="wrap">
          <div className="row between" style={{ alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div className="stack" style={{ gap: 14, maxWidth: 560 }}>
              <span className="eyebrow">{t.home.trustedBothSides}</span>
              <h2 className="display" style={{ fontSize: "clamp(30px,4.5vw,48px)" }}>{t.home.realOutcomes}</h2>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span className="row" style={{ gap: 3, color: "var(--gold-deep)" }}>{"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}</span>
              <span style={{ fontSize: 14, color: "var(--text-2)", fontWeight: 600 }}>4.9 / 5 · 1,200+ {t.home.reviews}</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="feat-grid">
            {TESTIMONIALS.map((tm) => (
              <div key={tm.name} className="card tcard" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ position: "relative", height: 230 }}>
                  <Photo src={tm.photo} name={tm.name} w="100%" h="100%" radius={0} kenburns />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,31,58,0.86) 0%, rgba(11,31,58,0.12) 55%, transparent 100%)" }} />
                  <span className="pill" style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.92)", color: "var(--pine)", fontSize: 11 }}>{tm.area}</span>
                  <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, color: "#fff" }}>
                    <div className="row" style={{ gap: 7 }}><strong style={{ fontSize: 16 }}>{tm.name}</strong><Verified size={15} /></div>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.82)" }}>{tm.role}</span>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div className="row" style={{ gap: 2, color: "var(--gold-deep)", marginBottom: 10 }}>{Array.from({ length: tm.stars }).map((_, j) => <span key={j} style={{ fontSize: 13 }}>★</span>)}</div>
                  <p className="serif" style={{ fontSize: 15.5, lineHeight: 1.55, color: "var(--ink)", fontStyle: "italic" }}>&ldquo;{tm.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust points */}
      <section style={{ padding: "90px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="feat-grid">
            {[
              ["shield", t.home.licenseVerified, t.home.licenseVerifiedDesc],
              ["lock", t.home.privateEncrypted, t.home.privateEncryptedDesc],
              ["bolt", t.home.fastExclusive, t.home.fastExclusiveDesc],
            ].map(([ic, title, d]) => (
              <div key={title} className="card" style={{ padding: 28 }}>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: "var(--verified-tint)", display: "grid", placeItems: "center", marginBottom: 18 }}><Icon name={ic} size={23} color="var(--verified)" /></div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 9 }}>{title}</h3>
                <p style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "10px 0 100px" }}>
        <div className="wrap">
          <div style={{ background: "var(--signal)", borderRadius: 26, padding: "70px 56px", textAlign: "center" }}>
            <div className="stack" style={{ gap: 22, maxWidth: 600, margin: "0 auto" }}>
              <h2 className="display" style={{ fontSize: "clamp(32px,5vw,52px)", color: "#fff" }}>{t.home.readyForLeads}</h2>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{t.home.startWithClientSignal}</p>
              <div className="row" style={{ gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-lg" style={{ background: "#fff", color: "var(--signal)" }} onClick={() => router.push("/attorney/signup")}>{t.nav.startFreeTrial}</button>
                <button className="btn btn-ghost-light btn-lg" onClick={() => router.push("/demo")}>{t.nav.bookADemo}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
