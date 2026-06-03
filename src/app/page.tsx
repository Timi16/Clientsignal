"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ScoreRing, Verified, Avatar, Photo } from "@/components/ui";
import { LEADS, TESTIMONIALS, CASE_TYPES } from "@/lib/data";
import { MarketingNav, Footer } from "@/components/marketing";

/* ===== HomeProductPreview (fake app window with lead inbox) ===== */
function HomeProductPreview() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % LEADS.length), 3200);
    return () => clearInterval(t);
  }, []);
  const lead = LEADS[active];
  const ct = CASE_TYPES[lead.type] || { label: lead.type, color: "var(--text-2)", tint: "var(--pine-tint)" };

  return (
    <div className="card rise" style={{
      borderRadius: 18, overflow: "hidden",
      boxShadow: "var(--sh-lg)", maxWidth: 540, width: "100%",
      animationDelay: ".2s",
    }}>
      {/* Title bar */}
      <div className="row between" style={{
        padding: "12px 18px", borderBottom: "1px solid var(--line)",
        background: "var(--paper)",
      }}>
        <div className="row" style={{ gap: 8 }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>Lead Inbox</span>
        <div style={{ width: 40 }} />
      </div>
      {/* Lead list */}
      <div style={{ padding: 0 }}>
        {LEADS.slice(0, 4).map((l, i) => {
          const ct2 = CASE_TYPES[l.type] || { label: l.type, color: "var(--text-2)", tint: "var(--pine-tint)" };
          return (
            <div key={l.id}
              onClick={() => setActive(i)}
              className="row"
              style={{
                padding: "14px 18px", gap: 14,
                cursor: "pointer",
                background: i === active ? "var(--signal-tint)" : "var(--card)",
                borderBottom: "1px solid var(--line)",
                transition: "background .2s",
              }}
            >
              <Avatar name={l.name} size={38} />
              <div className="stack" style={{ flex: 1, gap: 3, minWidth: 0 }}>
                <div className="row between">
                  <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>{l.name}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--text-3)" }}>{l.time}</span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <span className="pill" style={{
                    background: ct2.tint, color: ct2.color,
                    padding: "3px 9px", fontSize: 11,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: ct2.color }} />
                    {ct2.label}
                  </span>
                  <span style={{ fontSize: 12.5, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {l.city}
                  </span>
                </div>
              </div>
              <ScoreRing value={l.quality} size={40} stroke={4} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== Page ===== */
export default function HomePage() {
  const router = useRouter();

  return (
    <div id="m-scroll" style={{ height: "100vh", overflow: "auto" }}>
      <MarketingNav audience="home" />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
        <div style={{ position: "absolute", top: -240, right: -160, width: 760, height: 760, borderRadius: "50%", background: "radial-gradient(circle, var(--signal-tint) 0%, transparent 62%)", pointerEvents: "none" }} />
        <div className="wrap" style={{ position: "relative", paddingTop: 64, paddingBottom: 70 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.04fr 0.96fr", gap: 56, alignItems: "center" }} className="hero-grid">
            <div className="stack" style={{ gap: 24 }}>
              <span className="pill rise" style={{ background: "var(--card)", border: "1px solid var(--line)", color: "var(--text-2)", alignSelf: "flex-start" }}>
                <span className="pulse-dot" /> Verified attorneys · vetted cases
              </span>
              <h1 className="display rise" style={{ fontSize: "clamp(40px,5.6vw,72px)", animationDelay: ".08s" }}>
                Find the <span style={{ fontStyle: "italic", color: "var(--pine)" }}>right attorney</span>, fast<span style={{ color: "var(--signal-deep)" }}>.</span>
              </h1>
              <p className="rise" style={{ fontSize: "clamp(17px,2vw,20px)", color: "var(--text-2)", lineHeight: 1.55, maxWidth: 480, animationDelay: ".16s" }}>
                ClientSignal verifies every attorney and scores every case, then connects clients with licensed lawyers who can actually help — managed in one secure place.
              </p>
              <div className="row rise" style={{ gap: 13, flexWrap: "wrap", animationDelay: ".24s" }}>
                <button className="btn btn-ink btn-lg" onClick={() => router.push("/get-started")}>Get started free <Icon name="arrowR" size={18} /></button>
                <button className="btn btn-ghost btn-lg" onClick={() => router.push("/demo")}><Icon name="clock" size={17} /> Book a demo</button>
              </div>
              <div className="row rise" style={{ gap: 12, marginTop: 4, animationDelay: ".3s", alignItems: "center" }}>
                <div className="row" style={{ marginLeft: 4 }}>
                  {["Sarah Mitchell", "David Park", "Elena Reyes", "Carlos Ruiz"].map((n, i) => (
                    <div key={n} style={{ marginLeft: i ? -10 : 0, border: "2px solid var(--paper)", borderRadius: "50%" }}><Avatar name={n} size={32} /></div>
                  ))}
                </div>
                <div className="stack" style={{ gap: 1 }}>
                  <div className="row" style={{ gap: 3, color: "var(--gold-deep)" }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ fontSize: 12 }}>{s}</span>)}</div>
                  <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>Trusted by <strong style={{ color: "var(--text-2)" }}>2,400+</strong> verified attorneys</span>
                </div>
              </div>
            </div>
            <div className="rise" style={{ animationDelay: ".2s" }}><HomeProductPreview /></div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section style={{ borderBottom: "1px solid var(--line)", padding: "22px 0", background: "var(--card)" }}>
        <div className="wrap stack" style={{ gap: 16 }}>
          <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", textAlign: "center" }}>Built on the standards legal professionals trust</span>
          <div className="row" style={{ gap: 18, flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            {[["shield", "State Bar Verified"], ["lock", "SOC 2 Type II"], ["check", "ABA-aligned intake"], ["lock", "256-bit encryption"], ["scale", "Attorney-Client privilege safe"]].map(([ic, t]) => (
              <span key={t} className="row" style={{ gap: 8, padding: "8px 16px", borderRadius: 999, background: "var(--paper)", border: "1px solid var(--line)", fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}><Icon name={ic} size={15} color="var(--pine)" /> {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section style={{ padding: "70px 0 90px" }}>
        <div className="wrap">
          <div className="stack" style={{ alignItems: "center", textAlign: "center", gap: 12, marginBottom: 40 }}>
            <span className="eyebrow">Choose your path</span>
            <h2 className="display" style={{ fontSize: "clamp(28px,4vw,42px)" }}>Two sides, one trusted platform.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="hero-grid">
            {[
              { who: "For Clients", t: "Get matched with the right attorney.", d: "Describe your situation once, get matched with a verified attorney, and track your whole case — messages, documents and status — in one place. Always free.", icon: "scale", cta: "Find legal help", dest: "/for-clients", bg: "var(--blue-tint)", c: "var(--signal)" },
              { who: "For Attorneys", t: "Grow your practice with qualified clients.", d: "Receive vetted, scored, exclusive client opportunities matched to your practice areas and jurisdiction — and respond before anyone else.", icon: "briefcase", cta: "Grow my practice", dest: "/for-attorneys", bg: "var(--gold-tint)", c: "var(--gold-deep)" },
            ].map(p => (
              <div key={p.who} className="card feat-card" style={{ padding: 34, cursor: "pointer" }} onClick={() => router.push(p.dest)}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: p.bg, display: "grid", placeItems: "center", marginBottom: 20 }}><Icon name={p.icon} size={26} color={p.c} /></div>
                <span className="eyebrow" style={{ display: "block", marginBottom: 10 }}>{p.who}</span>
                <h3 className="display" style={{ fontSize: 26, marginBottom: 12 }}>{p.t}</h3>
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
            <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>How it works</span>
            <h2 className="display" style={{ fontSize: "clamp(30px,4.5vw,48px)", color: "#fff" }}>Trust, built into every step.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }} className="feat-grid">
            {[
              { icon: "user", title: "Create an account", desc: "Clients and attorneys each get a secure, dedicated workspace." },
              { icon: "pen", title: "Describe or set up", desc: "Clients outline their case; attorneys verify their licence & areas." },
              { icon: "shield", title: "We verify & match", desc: "Every attorney is licence-checked; every case is scored and routed." },
              { icon: "message", title: "Connect & resolve", desc: "Message, share documents and track everything in one dashboard." },
            ].map((s, i) => (
              <div key={s.title} className="stack rise" style={{ gap: 14, animationDelay: `${(i + 1) * 0.1}s` }}>
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
              <span className="eyebrow">Trusted by both sides</span>
              <h2 className="display" style={{ fontSize: "clamp(30px,4.5vw,48px)" }}>Real attorneys. Real clients. Real outcomes.</h2>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span className="row" style={{ gap: 3, color: "var(--gold-deep)" }}>{"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}</span>
              <span style={{ fontSize: 14, color: "var(--text-2)", fontWeight: 600 }}>4.9 / 5 · 1,200+ reviews</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }} className="feat-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card tcard" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ position: "relative", height: 230 }}>
                  <Photo src={t.photo} name={t.name} w="100%" h="100%" radius={0} kenburns />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,31,58,0.86) 0%, rgba(11,31,58,0.12) 55%, transparent 100%)" }} />
                  <span className="pill" style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,0.92)", color: "var(--pine)", fontSize: 11 }}>{t.area}</span>
                  <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, color: "#fff" }}>
                    <div className="row" style={{ gap: 7 }}><strong style={{ fontSize: 16 }}>{t.name}</strong><Verified size={15} /></div>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.82)" }}>{t.role}</span>
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div className="row" style={{ gap: 2, color: "var(--gold-deep)", marginBottom: 10 }}>{Array.from({ length: t.stars }).map((_, j) => <span key={j} style={{ fontSize: 13 }}>★</span>)}</div>
                  <p className="serif" style={{ fontSize: 15.5, lineHeight: 1.55, color: "var(--ink)", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
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
              ["shield", "Licence-verified attorneys", "Every attorney's bar licence, identity and firm are confirmed within 24 hours of joining — no exceptions."],
              ["lock", "Private & encrypted", "Client information is encrypted and shared only with a matched attorney. Never sold, never spammed."],
              ["bolt", "Fast, exclusive matches", "Cases are routed to one attorney at a time — not blasted to ten — so clients get real attention, fast."],
            ].map(([ic, t, d]) => (
              <div key={t} className="card" style={{ padding: 28 }}>
                <div style={{ width: 50, height: 50, borderRadius: 13, background: "var(--verified-tint)", display: "grid", placeItems: "center", marginBottom: 18 }}><Icon name={ic} size={23} color="var(--verified)" /></div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 9 }}>{t}</h3>
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
              <h2 className="display" style={{ fontSize: "clamp(32px,5vw,52px)", color: "#fff" }}>Ready to get started?</h2>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>Create your free account and get to the right place in seconds.</p>
              <div className="row" style={{ gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-lg" style={{ background: "#fff", color: "var(--signal)" }} onClick={() => router.push("/get-started")}>Get started free</button>
                <button className="btn btn-ghost-light btn-lg" onClick={() => router.push("/login")}>Login</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
